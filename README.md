TDC
=
The complete patient management system for a dental clinic; built on JavaScript stack.

**Note:** If you are using Windows, checking out **Windows Setup** might make things easier for you.

## Tech Stack
- Database: MongoDB (via Mongoose)
- Backend: NodeJS
- API server: Express

## Modules
- Patient
- Treatment
- Appointment
- Invoice

## Requirements
- NodeJS ([download](https://nodejs.org/en/download/))
- MongoDB ([download](https://www.mongodb.com/try/download/community) / [install manually](https://docs.mongodb.com/manual/installation/))

## Windows Setup
This API was mainly created to work with [TDC-client](). **win-setup.bat** is a file designed specifically to install and setup all the packages necessary for both the repositories and start working instantly. If you do not wish to use the front-end, please proceed with the installation below.
### Using the win-setup
Using **win-setup.bat** has it's own conditions; it requires both the repositories to be downloaded parallelly. The folder structure required is as such
```
parent folder
|-- TDC\
|   |-- package.json
|   |-- win-setup.bat
|-- TDC-client\
|   |-- package.json
```
The file downloads the necessary package dependencies for both the repos and creates a **RunTDC.bat** on the user desktop. Clicking the run file will start the full stack app readily on the user browser.

## Package Installation
### Dependencies for Dist.zip
If you have downloaded the **Dist.zip** release, congratulations, you do not need to build the application. Simply run the command
``` npm install --production```
and you're ready to go.
### Dependencies for the repo
This app requires to be built first to start the server. Run the command
``` npm i && npm run build```
which will create a `dist/` folder on the root directory.

## First run
If you have successfully downloaded all the package dependencies, you can run
```npm start```
and voila, your API is running locally at `http://localhost:8000/`.

## API
To understand the modules & endpoints, try going through the [API documentation](https://github.com/datmemerboi/TDC/blob/main/API%20Documentation.md)


If you are interested in the previous versions, checkout the [releases page](https://github.com/datmemerboi/TDC/releases) or the [CHANGELOG](https://github.com/datmemerboi/TDC/wiki/Changelog).
