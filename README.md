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
- Monthly Split of patients
- CSV <--> JSON

### Requirements
**Nodejs (with npm)**

### Run
Windows system: `win-setup.bat` will create a desktop shortcut(`RunTDC.bat`). Simply run it.

Other platforms: Run `npm install && npm start`

### Note
Exporting null data (monthly or copy) will crash the app; refrain from doing so until the necessary updates are made.

If you have pre-existing CSV data:
> run `node CSVtoJSON.js `filename` data.json`
or
> copy it into *data/data.csv* and run `node CSVtoJSON.js`

Run `node CSVtoJSON.js` to use the dummy data in *data/data.csv*.
