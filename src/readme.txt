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

Deploy SampleAngular application on Heroku with Heroku CLI:
1.First of all, we need a server for our application and what we are going to use is the Express server.
Locally we run ng serve from terminal to run our app on local browser.
Install il with:
   npm install express --save
2. Now we need a script in JS to tell Express what to do, I like to call it server.js (in your project’s root directory)
Test That Everything is OK:
>ng build  - build and create dist folder
>node server.js -lance the app
3.Change start command
In package.json, change the “start” command to node server.js so:
   "start": "ng serve -o"  becomes:  "start": "node server.js"
We can add also Node and NPM engines that Heroku will use to run your application. 
Preferably, it should be same version you have on your machine.
So, run node -v and npm -v to get the correct version and include it in your package.json file like so:
"engines": {
    "node": "12.13.0",
    "npm": "6.12.0"
  }

Deploy SampleAngular application on GitHub Pages:
Set a certificate if necessary:
>set NODE_EXTRA_CA_CERTS=d:\python\examples\heroku\ANFH-CA.cer
1.Install Angular CLI gh-pages:
>npm i angular-cli-ghpages --save-dev
2.Run Build
>ng build --prod --base-href "https://danielvornicu.github.io/SampleAngular/" 
4.Deploy to gh-pages:
>npx angular-cli-ghpages --dir=dist/SampleAngular
5: Go to App Page:
https://danielvornicu.github.io/SampleAngular

Deploy SampleAngular application on Surge:
1.install Surge globally:
>npm install --global surge
2.Run Build
>ng build --prod
3.Now, run surge from within any directory, to publish that directory onto the web.
>cd dist\SampleAngular
Set a certificate if necessary:
>set NODE_EXTRA_CA_CERTS=d:\python\examples\heroku\ANFH-CA.cer
>surge enter email and password and domain: sample-crud-angular.surge.sh
Go to generated domain: sample-crud-angular.surge.sh

Shorthand usage:
  surge [project path] [domain]

Additional commands:
  surge whoami        show who you are logged in as
  surge logout        expire local token
  surge login         only performs authentication step
  surge list          list all domains you have access to
  surge teardown      tear down a published project
