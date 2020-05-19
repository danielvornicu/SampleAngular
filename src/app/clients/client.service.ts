import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IClient } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private isInMemoryWebApiModule : boolean = true; //and uncomment InMemoryWebApiModule.forRoot in ClientModule
  private clientsUrl = 'api/clients';

  //private isInMemoryWebApiModule : boolean = false; //and comment InMemoryWebApiModule.forRoot in ClientModule
  //private clientsUrl = 'http://localhost:8090/clients';  

  constructor(private http: HttpClient) { }

  //get all clients
  findAll(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.clientsUrl).pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  //get client by id
  findById(id: number): Observable<IClient> {
    const url = `${this.clientsUrl}/${id}`;
    return this.http.get<IClient>(url)
      .pipe(
        tap(data => console.log('getClient: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  //create new Client or update existing one (use only HTTP POST for two cases)
  save(client: IClient, isCreation : boolean): Observable<IClient> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let url;

    if (isCreation){
      if (this.isInMemoryWebApiModule) {
        client.id = null;

        url = `${this.clientsUrl}`; 
      } else {
        url = `${this.clientsUrl}` + '/new';
      } 
    } else { //modification
      url = `${this.clientsUrl}/${client.id}` + '/edit';
    }

    return this.http.post<IClient>(url, client, { headers })
      .pipe(
        tap(data => console.log('createOrUpdateClient: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  //delete a client by id (HTTP GET or HTTP DELETE for InMemoryWebApiModule) 
  deleteById(id: number): Observable<IClient[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.clientsUrl}/${id}` + '/delete';

    //use HTTP DELETE
    if (this.isInMemoryWebApiModule) {
      return this.http.delete<IClient[]>(url, { headers })
      .pipe(
        tap(data => console.log('deleteClient HTTP DELETE: ' + id)),
        catchError(this.handleError)
      );
    } else { //HTTP GET
      return this.http.get<IClient[]>(url, { headers })
      .pipe(
        tap(data => console.log('deleteClient HTTP GET: ' + id)),
        catchError(this.handleError)
      );
    }

  } 

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  initializeObject(): IClient {
    // Return an initialized object
    return {
      id: -1,
      nom: null,
      prenom: null
    };
  }ss

}
