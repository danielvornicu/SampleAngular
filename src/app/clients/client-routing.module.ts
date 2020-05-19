import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClientListeComponent } from './client-liste.component';
import { ClientConsultComponent } from './client-consult.component';
import { ClientFicheComponent } from './client-fiche.component';


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'clients', component: ClientListeComponent },
      //il faut mettre 'clients/new' avant 'clients/:id'
      {
        path: 'clients/new',
        component: ClientFicheComponent
      },
    	{ 
        path: 'clients/:id', 
        component: ClientConsultComponent 
      },
      {
        path: 'clients/:id/edit',
        component: ClientFicheComponent
      }
    ])
  ],
  exports : [RouterModule]
})
export class ClientRoutingModule { }
