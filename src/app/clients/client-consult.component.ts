import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IClient } from './client';
import { ClientService } from './client.service';

import messages from '../../assets/messages.json';

@Component({
  selector: 'app-client-consult',
  templateUrl: './client-consult.component.html',
  styleUrls: ['./client-consult.component.css']
})
export class ClientConsultComponent implements OnInit {
  //JSON avec les messages
  msg = messages;

  errorMessage = '';
  client: IClient|undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientService: ClientService) { }

  ngOnInit() {
    console.log('client-consult: In OnInit');
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
       const id = +param;  //convert string to number
       this.initializeShow(id);
    }
  }

  initializeShow(id : number){
    this.clientService.findById(id).subscribe({
      next: client => this.client = client,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/clients']);
  }

}
