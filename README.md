TDC
=
## NodeJS | Express

A patient management system built on Nodejs & Express JS framework.
A very basic system which mainly works on JSON / CSV files instead of using any database.

### Modules
- View patient list
- Add patients
- Search patient details
- Update patient details
- Monthly Split of Patients
- CSV <--> JSON

### Note
Empty *data.json* will **NOT** crash the application. You can add data first and then check the View functionality.

If you have pre-existing data, copy the file to */data* and run `node CSVtoJSON.js `*filename*` data.json`.
Else, run `node CSVtoJSON.js` to use the dummy data from *data/data.csv*.

### Run
Windows system: Executing `setup.bat` should start the server.

Other platforms: `npm install` and `nodemon server.js`
