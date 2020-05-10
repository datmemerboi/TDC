TDC
=
## NodeJS | Express

A patient management system built on Nodejs & Express JS framework.
A very basic system which mainly works on JSON / CSV files instead of using any database.

**Modules**
- View patient list
- Add patients
- Search patient details
- Update patient details
- Monthly Split of Patients
- CSV <--> JSON

**Note**
*data.json* is empty, which will crash the application on View / Search / Update. You can add data first and then view.

If you have pre-existing data, copy the file to */data* and run `node CSVtoJSON.js `*filename*` data.json`.
Else, run `node CSVtoJSON.js` to use the dummy data from *data/data.csv*.

**Run**
Windows system: `node setup.js` and `node server.js`
Other platforms: `npm install` and `nodemon server.js`
