import { NgModule } from '@angular/core';

import { ClientListeComponent } from './client-liste.component';
import { ClientConsultComponent } from './client-consult.component';
import { ClientFicheComponent } from './client-fiche.component';
import { ClientRoutingModule } from './client-routing.module';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClientData } from './client-data';

@NgModule({
  declarations: [ClientListeComponent, ClientConsultComponent, ClientFicheComponent],
  imports: [
    SharedModule,
    InMemoryWebApiModule.forRoot(ClientData, { delay: 0 }),
    ClientRoutingModule
  ]
})
export class ClientModule { }
