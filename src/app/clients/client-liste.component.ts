import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IClient } from './client';
import { ClientService } from './client.service';

import messages from '../../assets/messages.json';

@Component({
  //selector: 'app-client-liste',
  templateUrl: './client-liste.component.html',
  styleUrls: ['./client-liste.component.css']
})
export class ClientListeComponent implements OnInit {
  //JSON avec les messages
  msg = messages;
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredClients = this.listFilter ? this.performFilter(this.listFilter) : this.clients;
  }

  clients : IClient[] = [];
  filteredClients: IClient[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientService: ClientService) { }

  ngOnInit() {
    console.log('client-liste: In OnInit');
    this.initializeIndex();
  }

  initializeIndex(): void {
    this.clientService.findAll().subscribe({
      next: clients => {
        //console.log(clients);
        this.clients = clients;
        this.filteredClients = this.clients;
      },
      //next : data =>this.handleSuccessfulResponse(data),
      error: err => this.errorMessage = err
    });
  }

  handleSuccessfulResponse(data)
  {
    console.log(data);
    this.clients=data;
  }

  performFilter(filterBy: string): IClient[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.clients.filter((client: IClient) =>
      client.prenom.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  delete(id: number, nom, prenom : string): void {
      if (confirm(this.msg.fiche.boutons.supprimerConfirm+`${nom} ${prenom}?`)) {
        this.clientService.deleteById(id).subscribe({
            next: () => { 
              this.initializeIndex();
          },
            error: err => this.errorMessage = err
          });
      }
  }


}
