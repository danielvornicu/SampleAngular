import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IClient } from './client';
import { ClientService } from './client.service';

import { GenericValidator } from '../shared/generic-validator';

import messages from '../../assets/messages.json';

@Component({
  selector: 'app-client-fiche',
  templateUrl: './client-fiche.component.html',
  styleUrls: ['./client-fiche.component.css']
})

export class ClientFicheComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(FormControlName, { read: ElementRef }) 
  formInputElements: ElementRef[];  

  //JSON avec les messages
  msg = messages;
  errorMessage: string;
  pageTitle: string;

  clientForm: FormGroup;
  client: IClient;
  private subscription: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private clientService: ClientService) { 

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      nom: {
        required: this.msg.fiche.client.validation.nom.required,
        minlength: this.msg.fiche.client.validation.nom.minlength,
        maxlength: this.msg.fiche.client.validation.nom.maxlength
      }, 
      prenom: {
        required: this.msg.fiche.client.validation.prenom.required,
        minlength: this.msg.fiche.client.validation.prenom.minlength,
        maxlength: this.msg.fiche.client.validation.prenom.maxlength
      }
    };

    // Define an instance of the validator for use with this form
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    console.log('client-fiche: In OnInit');

    this.clientForm = this.fb.group({
      nom: ['', [Validators.required,
                 Validators.minLength(3),
                 Validators.maxLength(50)]],
      prenom: ['', [Validators.required,
                   Validators.minLength(3),
                   Validators.maxLength(50)]],
    });

    // Read the product Id from the route parameter
    this.subscription = this.route.paramMap.subscribe(
      params => {
        const stringId = params.get('id');
        const id = +stringId;

        //id = -1 for creation, but here the conversion +params.get('id') convert null to int tehn id = 0
        if (id === 0){
          this.initializeNew();
        } else {
          this.initializeEdit(id);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.startControlMonitoring(this.clientForm);
  }

  protected startControlMonitoring(formGroup: FormGroup): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(formGroup.valueChanges, ...controlBlurs).pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(formGroup);
    });
  }

  initializeNew(): void {
    this.pageTitle = `${this.msg.fiche.client.titres.creation}`;
    this.client = this.clientService.initializeObject();
  }

  initializeEdit(id: number): void {
    this.pageTitle = `${this.msg.fiche.client.titres.modification}`;

    this.clientService.findById(id)
    .subscribe({
      next: (client: IClient) => this.fillForm(client),
      error: err => this.errorMessage = err
    });
  }

  fillForm(client: IClient): void {
    if (this.clientForm) {
      this.clientForm.reset();
    }
    this.client = client;
    // Update the data on the form
    this.clientForm.patchValue({
      nom: this.client.nom,
      prenom: this.client.prenom
    });
    this.pageTitle = this.pageTitle + `${this.client.nom} ${this.client.prenom}`;
  }

  save(): void {
    if (this.clientForm.valid) {
      if (this.clientForm.dirty) {
        const p = {...this.client, ...this.clientForm.value};
        console.log('obj :' + p.id + '/' + p.nom + '/' + p.prenom);

        if (p.id === -1) {
          //console.log("dirty create");
          this.clientService.save(p, true)
            .subscribe({
              next: () => this.onComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          //console.log("dirty update");
          this.clientService.save(p,false)
            .subscribe({
              next: () => this.onComplete(),
              error: err => this.errorMessage = err
            });
        }

      } else { //not  dirty
        //console.log("not dirty");
        this.onComplete();
      }
    } else {  //not valid
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  delete(): void {
    if (this.client.id === -1) {
      // Don't delete, it was never saved.
      console.log("not saved");
      this.onComplete();
    } else {
      if (confirm(this.msg.fiche.boutons.supprimerConfirm + `${this.client.nom} ${this.client.prenom}?`)) {
        this.clientService.deleteById(this.client.id)
          .subscribe({
            next: () => this.onComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }
s
  onComplete(): void {
    console.log("complete");
    // Reset the form to clear the flags
    this.clientForm.reset();
    this.router.navigate(['/clients']);
  }

}
