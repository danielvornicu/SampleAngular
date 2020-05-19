node --version => v12.13.0 (Node version)
npm --version  => 6.12.0 (Npm version)
ng --version(or ng v) =>  8.3.14  (Angular CLI version)
npm install -g @angular/cli  - install Angular Command Line Interface globally: for Component and Service part (for using ng...)


Create app:
>ng new SampleAngular
>cd SampleAngular
SA>npm start

Install dependencies: bootstrap, font-awesome and angular-in-memory-web-api (in dev only)
>npm install bootstrap font-awesome 
>npm install angular-in-memory-web-api --save-dev   - save devDependencies(for fake backend http server)

Import this styles globally in style.css:
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "~font-awesome/css/font-awesome.min.css";

SA>ng g c home/welcome --flat

Build a feature module(ClientModule)
SA>ng g m clients/client --flat -m app  (--flat no new folder, -m app for import the created module in app module)
SA>ng g c clients/clientListe --flat -m client
SA>ng g c clients/clientConsult --flat -m client
SA>ng g c clients/clientFiche --flat -m client

It's a good practice to create a SharedModule that exports: CommonModule, FormsModule etc
APM>ng g m shared/shared --flat  -m clients/client.module 

App Routing module:
APM>ng g m app-routing --flat  -m app.module 
Client Routing module:
APM>ng g m clients/client-routing --flat  -m clients/client.module 

Add a class(clients datat) and a http service:
ng g cl clients/client-data     
ng g s clients/client

Import JSON file comme module:
Le framework Angular supporte TypeScript 2.9 à partir de la version 6.1.
Dans typescript 2.9 avec l’aide de resolveJsonModule nous pouvons importer des fichiers JSON locaux comme des modules
Pour ca ajout ca dans tsconfig.json in compilerOptions:
{  "compilerOptions": {  "resolveJsonModule": true, "esModuleInterop": true } }


In Spring App:
Suport CORS in Spring App, add @CrossOrigin annotation to the rest controller to specify that calls will be made to this controller from different domains
(In our case we have specified that a call can be made form localhost:4200)
@CrossOrigin(origins = "http://localhost:4200")
@RestController

In Angular APP:
If you are using InMemoryWebApiModule change the url in ClientService: private clientsUrl = 'api/clients'; => private clientsUrl = 'http://localhost:8090/clients'; 
then in ClientModule comment the line
//InMemoryWebApiModule.forRoot(ClientData),

A simple client for REST api in Angular:
http://localhost:4200/clients                    HTTP GET         - get all clients
http://localhost:4200/clients/new                HTTP GET/POST    - create client
http://localhost:4200/clients/1                  HTTP GET         - consult client
http://localhost:4200/clients/1/edit             HTTP GET/POST    - edit client
http://localhost:4200/clients/1/delete           HTTP GET or HTTP DELETE for InMemoryWebApiModule  - delete client

http://localhost:4200/welcome - test page


Others(not used):
Create a proxy for CORS support:
We create a file next to our project's package.json called proxy.conf.json with the content
{
  "/api/clients": {
    "target": "http://localhost:8090/clients",
    "secure": true
  }
}
then I modified the start command in the package.json file:
"start": "ng serve -o --proxy-config proxy.conf.json"



