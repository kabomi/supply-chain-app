# Supply Chain Track and Trace System POC
A system that allows users to track and trace supply chain items

## Background
This app is part of a technical assessment. It has been coded mostly following BDD approach.


## Requirements
The system will have two main components: 
* REST API 
* Web Application 

### The REST API 
Implement the backend using TypeScript
Must offer an interface with this set of functions at a minimum: 
* Create a new supply chain item 
* Update supply chain item reference data (color, price, etc.) 
* Add new events associated with an item (for instance, where the item is, who has the custody, etc.) 
* Query all events of an item. Particularly, a shortcut to get the last event will be quite helpful to know the current location / custodian of the item. 

The following non-functional requirements also need to be met. 
* An OpenAPI / Swagger specification for the API built 
* A JSON Schema that can also be used at runtime for payload validation purposes 
* A Dockerfile for deployment of the API. 


### The Web Application
Implement using your favorite Single Page Application Framework
Must offer end users the capability to:
* query the supply chain trail of an item by using the query interface offered by the REST API. 
* A bonus point will be a responsive web application, as mobile users are also expected. 
* An additional bonus point will be a Dockerfile for deployment of the Web application. 


## Prerequisites
- Node Version >= 18.18.2
- NPM Version >= 10.9.2

## Getting Started

### General Info
- This app is created from the scratch, but the client based on react was created using: `npm create vite@latest supply-chain-client -- --template react-ts` which generates a react app.

- It has been tested on a Mac with OS Ventura 13.1

### Starting the application
--

Before starting the application you need to install the recommended versions of Node and NPM. Then you are fine running `npm` to install all the npm packages.
After starting the application with `npm start` you can open it on your browser at [http://http://localhost:3000/](http://http://localhost:3000/).

### `npm dev`

Runs the app in the development mode.<br />
This means the server will point to a local instance on [http://localhost:3000](http://localhost:3000). It will listen to any changes on the server.

The client app connects to the server via proxy set on package.json pointing to [http://localhost:3000](http://localhost:3000)


### `npm dev:server`

Same as `npm dev` but without running `npm build:client`.



## Testing the application

At this time, we only have unit tests, but it is planned to have some e2e tests using playwright or cypress.

---

### `npm test`

This command, will launch a Jest Test Runner in watch mode. The runner will run all the tests whenever a change in your code happens.

### `npm test:ci`

Launches the test runner on a single run and collects code coverage.

### `npm lint`

We are using eslint with prettier in order to avoid typical issues and to have a common coding-style.
Feel free to configure your IDE prettier/eslint plugins to don't have the need to run this command.

## Building the application

### `npm build`

This command will generate the server production files, ready to be deployed.

### `npm build:client`

This command will generate the client production files, ready to be deployed.


## Deploy the application

### Docker-compose
Use `BASIC_AUTH_USERNAME=harry BASIC_AUTH_PASSWORD=potter npm run build:client && docker-compose up --build` to run the server and the client in production mode.
Or set the variables in your `prod.env` and run `npm run start`

### Server Dockerfile
A docker image for the server can be built using this command:
`docker build -t supply-chain-app-server -f ./server/Dockerfile .`

A container with the production files can be run on PORT 8080 like this:
`docker run -d -p 8080:3000 -e BASIC_AUTH_USERNAME=harry -e BASIC_AUTH_PASSWORD=potter -e CLIENT_URL=http://localhost:5100 -e PUBLIC_API_PORT=8080 supply-chain-app-server:latest`

### Client Dockerfile
A docker image for the client can be built using these commands:
`npm run build:client`
`docker build -t supply-chain-client -f client/Dockerfile .`

A container with the production files can be run on PORT 5100 like this:
`docker run -d -p 5100:80 supply-chain-client:latest`


## Contributing and Known issues

To contribute to this repository feel free to create a PR.

---

### Structure

As we are starting our app and we don't know the future stories/epics, we are grouping our files by separating concerns technically. The client is on the the `client` folder and is based on react (vite).

So if you are contributing to this project please keep that in mind.

## Committing

-  We usually have **two reviewers** per merge request, to share knowledge as wide a possible in our team. We encourage pair review sessions too.
-  We plan to have a **pre-commit hook**, using`husky`, that runs lint and unit test the project before every commit.
