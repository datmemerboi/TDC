TDC API
=
The TDC application contains the following modules
- Patient
- Treatment
- Appointment
- Invoice
- File

**Note:** All input data of type *Date* accepts both JS time (milliseconds) and Epoch timestamp.

## Patient
Here's a quick overview of the Patient endpoints
```
POST /api/patient/new
GET /api/patient/all
GET /api/patient/get/:pid
GET /api/patient/search
PUT /api/patient/update/:pid
```

### Create Patient
Create a new patient record
```
POST /api/patient/new/
```
#### Request Body
Required fields: **name**, **contact**
```
{
  name:             String,
  dob:              Date,
  age:              Number,
  area:             String,
  gender:           String,
  address:          String,
  contact:          Number,
  med_history:      [ String ],
  current_meds:     [ String ],
  files:            [ String ]
}
```
#### Response
**Status 201**
```
{
  name:         String,
  contact:      Number,
  p_id:         String
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request POST 'http://127.0.0.1:8000/api/patient/new/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Taika Waititi",
    "gender": "M",
    "contact": 977777644444,
    "area": "Waihau Bay",
    "dob": 177359400
}'
</pre>
<pre>
{
    "name": "Taika Waititi",
    "gender": "M",
    "contact": 977777644444,
    "area": "Waihau Bay",
    "dob": 177359400000,
    "age": 45,
    "p_id": "PAT0001"
}
</pre>
</details>

### List Patients
List all patient records
```
GET /api/patient/all/
```
Allowed Methods: GET, POST, PUT
#### Response
**Status 200**
```
{
  total_docs:     Number,
  docs: [
    {
      p_id:             String,
      name:             String,
      dob:              Date,
      age:              Number,
      area:             String,
      gender:           String,
      address:          String,
      contact:          Number,
      med_history:      [ String ],
      current_meds:     [ String ],
      files:            [ String ],
      created_at:       Date
    }
  ]
}
```
**Status 204** No data found

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request GET 'http://127.0.0.1:8000/api/patient/all/'
</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "dob": "1975-08-15T18:30:00.000Z",
            "age": 45,
            "gender": "M",
            "address": null,
            "med_history": [],
            "current_meds": [],
            "files": [],
            "name": "Taika Waititi",
            "contact": 977777644444,
            "area": "Waihau Bay",
            "p_id": "PAT0001",
            "created_at": "2021-04-27T14:22:34.294Z"
        }
    ]
}
</pre>
</details>

### Get Patient
Get one patient record by patient id
```
GET /api/patient/get/:pid
```
Allowed Methods: GET, POST, PUT
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pid</td>
      <td>String</td>
      <td>The id of the patient to fetch</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  p_id:            String,
  name:           String,
  dob:            Date,
  age:            Number,
  area:           String,
  gender:         String,
  address:        String,
  contact:        Number,
  med_history:    [ String ],
  current_meds:   [ String ],
  files:          [ String ],
  created_at:     Date
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request POST 'http://127.0.0.1:8000/api/patient/get/PAT0001'</pre>
<pre>
{
    "dob": "1975-08-15T18:30:00.000Z",
    "age": 45,
    "gender": "M",
    "address": null,
    "med_history": [],
    "current_meds": [],
    "files": [],
    "name": "Taika Waititi",
    "contact": 977777644444,
    "area": "Waihau Bay",
    "p_id": "PAT0001",
    "created_at": "2021-04-27T14:22:34.294Z"
}
</pre>
</details>

### Search Patient
Search for a patient record by  *area* or *contact*.
```
GET /api/patient/search/
```
Allowed Methods: GET, POST, PUT

#### Query Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td>String</td>
      <td>The type of data to search. Can be <strong>Contact</strong> or <strong>Area</strong></td>
    </tr>
    <tr>
      <td>term</td>
      <td>String</td>
      <td>The term to search for (the contact number or the area)</td>
    </tr>
  </tbody>
</table>

**Note:** If you are using POST or PUT methods, you can pass the above parameters in the request body.

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      p_id:             String,
      name:             String,
      dob:              Date,
      age:              Number,
      area:             String,
      gender:           String,
      address:          String,
      contact:          Number,
      med_history:      [ String ],
      current_meds:     [ String ],
      files:            [ String ],
      created_at:       Date
    }
  ]
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample (Contact)</summary>
<pre>curl --location --request GET 'http://127.0.0.1:8000/api/patient/search/?type=contact&term=977777644444'</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "dob": "1975-08-15T18:30:00.000Z",
            "age": 45,
            "gender": "M",
            "address": null,
            "med_history": [],
            "current_meds": [],
            "files": [],
            "name": "Taika Waititi",
            "contact": 977777644444,
            "area": "Waihau Bay",
            "p_id": "PAT0001",
            "created_at": "2021-04-27T14:22:34.294Z"
        }
    ]
}
</pre>
</details>

<details>
<summary>Sample (Area)</summary>
<pre>curl --location --request GET 'http://127.0.0.1:8000/api/patient/search/?type=Area&term=bay'</pre>
<pre>
  {
    "total_docs": 1,
    "docs": [
        {
            "dob": "1975-08-15T18:30:00.000Z",
            "age": 45,
            "gender": "M",
            "address": null,
            "med_history": [],
            "current_meds": [],
            "files": [],
            "name": "Taika Waititi",
            "contact": 977777644444,
            "area": "Waihau Bay",
            "p_id": "PAT0001",
            "created_at": "2021-04-27T14:22:34.294Z"
        }
    ]
}
</pre>
</details>

### Update Patient
Update an existing patient record
```
PUT /api/patient/update/:pid
```
The request body should contain changes to be made to the patient document.

#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pid</td>
      <td>String</td>
      <td>The id of the patient to fetch</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  p_id:           String,
  name:           String,
  dob:            Date,
  age:            Number,
  area:           String,
  gender:         String,
  address:        String,
  contact:        Number,
  med_history:    [ String ],
  current_meds:   [ String ],
  files:          [ String ],
  created_at:     Date
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request PUT 'http://127.0.0.1:8000/api/patient/update/PAT0001' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "current_meds": [
          "Aspirin",
          "Paracetamol"
      ],
      "address": "2, Random Address, New Zealand"
  }'
</pre>
<pre>
{
    "dob": "1975-08-15T18:30:00.000Z",
    "age": 45,
    "gender": "M",
    "address": "2, Random Address, New Zealand",
    "med_history": [],
    "current_meds": [
        "Aspirin",
        "Paracetamol"
    ],
    "files": [],
    "name": "Taika Waititi",
    "contact": 977777644444,
    "area": "Waihau Bay",
    "p_id": "PAT0001",
    "created_at": "2021-04-27T14:22:34.294Z"
}
</pre>
</details>

### Import Patients
Import XLS file containing patient records. Filename (present in `data/` folder) to be passed in request body.
```
PUT /api/patient/import
```
#### Request Body
Required fields: **file**
```
{
  file:   String
}
```
#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      p_id:       String,
      name:       String,
      contact:    Number
    }
  ]
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>curl --location --request PUT 'http://127.0.0.1:8000/api/patient/import' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "file": "Patients.xlsx"
    }'</pre>
  <pre>
    {
      "total_docs": 3,
      "docs": [
          {
              "name": "Angel",
              "contact": 2020202020,
              "area": "Spain",
              "med_history": [
                  "Blood Pressure",
                  "Diabetes"
              ],
              "p_id": "PAT0005"
          },
          {
              "p_id": "PAT0003",
              "name": "Maria",
              "contact": 1234567890,
              "area": "Germany"
          },
          {
              "name": "Rick Astley",
              "contact": 30008000,
              "area": "America",
              "med_history": [
                  "Never gives up"
              ],
              "p_id": "PAT0006"
          }
      ]
  }
  </pre>
</details>

### Export Patients
Export patient records to XLS file. Exports into `data/Patient List(Month YYYY).xls`.
```
GET /api/patient/export/
```
#### Response
**Status 200**
```
{
  total_docs:   Number
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>curl --location --request GET 'http://127.0.0.1:8000/api/patient/export/'</pre>
  <pre>
    {
      "total_docs": 6
    }
  </pre>
</details>

## Treatment
Here's a quick overview of all Treatment endpoints
```
POST /api/treatment/new
GET /api/treatment/all
GET /api/treatment/get/:tid
GET /api/treatment/patient/:pid
GET /api/treatment/history/:pid
PUT /api/treatment/update/:tid
```

### Create Treatment
Create a new treatment record
```
POST /api/treatment/new/
```
#### Request Body
Required fields: **p_id**, **doctor**, **procedure_done**
```
{
  p_id:               String,
  doctor:             String,
  procedure_done:     String,
  treatment_date:     Date,
  remarks:            String,
  teeth_number:       [ Number ]
}
```
#### Response
**Status 201**
```
{
  p_id:             String,
  doctor:           String,
  procedure_done:   String,
  t_id:             String
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request POST 'http://127.0.0.1:8000/api/treatment/new/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "doctor" : "Dr. Who",
      "p_id" : "PAT0001",
      "procedure_done" : "General Checkup",
        "treatment_date": 1616410800
    }'
</pre>
<pre>
{
    "doctor": "Dr. Who",
    "p_id": "PAT0001",
    "procedure_done": "General Checkup",
    "treatment_date": 1616410800000,
    "t_id": "TRT0001"
}
</pre>
</details>

### List Treatments
List all the treatment records
```
GET /api/treatment/all/
```
Allowed Methods: GET, POST, PUT

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      p_id:               String,
      doctor:             String,
      procedure_done:     String,
      treatment_date:     Date,
      remarks:            String,
      teeth_number:       [ Number ],
      created_at:         Date
    }
  ]
}
```
**Status 204** No data found

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request GET 'http://127.0.0.1:8000/api/treatment/all/'</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "procedure_done": "General Checkup",
            "teeth_number": [],
            "remarks": null,
            "doctor": "Dr. Who",
            "p_id": "PAT0001",
            "treatment_date": "2021-03-22T11:00:00.000Z",
            "t_id": "TRT0001",
            "created_at": "2021-04-27T17:49:55.970Z"
        }
    ]
}
</pre>
</details>

### Get Treatment by ID
Get one treatment record by treatment id
```
GET /api/treatment/get/:tid
```
Allowed Methods: GET, POST, PUT
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tid</td>
      <td>String</td>
      <td>The id of the treatment to fetch</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  p_id:               String,
  doctor:             String,
  procedure_done:     String,
  treatment_date:     Date,
  remarks:            String,
  teeth_number:       [ Number ],
  created_at:         Date
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request POST 'http://127.0.0.1:8000/api/treatment/get/TRT0001'</pre>
<pre>
{
    "procedure_done": "General Checkup",
    "teeth_number": [],
    "remarks": null,
    "doctor": "Dr. Who",
    "p_id": "PAT0001",
    "treatment_date": "2021-03-22T11:00:00.000Z",
    "t_id": "TRT0001",
    "created_at": "2021-04-27T17:49:55.970Z"
}
</pre>
</details>


### Get Treatments by Patient
Get the treatment records for a patient by patient id
```
GET /api/treatment/patient/:pid
```
Allowed Methods: GET, POST, PUT
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pid</td>
      <td>String</td>
      <td>The id of the patient to fetch treatments</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      p_id:               String,
      doctor:             String,
      procedure_done:     String,
      treatment_date:     Date,
      remarks:            String,
      teeth_number:       [ Number ],
      created_at:         Date
    }
  ]
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request POST 'http://127.0.0.1:8000/api/treatment/patient/PAT0001'</pre>
<pre>
{
    "total_docs": 2,
    "docs": [
        {
            "procedure_done": "General Checkup",
            "teeth_number": [],
            "remarks": null,
            "doctor": "Dr. Who",
            "p_id": "PAT0001",
            "treatment_date": "2021-03-22T11:00:00.000Z",
            "t_id": "TRT0001",
            "created_at": "2021-04-27T17:49:55.970Z"
        },
        {
            "procedure_done": "Filling",
            "teeth_number": [],
            "remarks": null,
            "doctor": "Dr. Who",
            "p_id": "PAT0001",
            "treatment_date": "2021-03-24T05:30:00.000Z",
            "t_id": "TRT0002",
            "created_at": "2021-04-27T17:51:18.643Z"
        }
    ]
}
</pre>
</details>

### Get Treatment History
Get the treatment history of a patient by patient id
```
GET /api/treatment/history/:pid
```
Allowed Methods: GET, POST, PUT
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pid</td>
      <td>String</td>
      <td>The id of the patient to fetch treatment history</td>
    </tr>
  </tbody>
</table>

#### Query Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>quick</td>
      <td>Boolean</td>
      <td>To filter and obtain a concise history</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  total_docs:   Number,
  procedures: [
    {
      doctor:             String,
      procedure_done:     String,
      treatment_date:     Date,
      remarks:            String,
      teeth_number:       [ Number ]
    }
  ],
  doctors:      [ String ],
  last_visit:   Date
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request GET 'http://127.0.0.1:8000/api/treatment/history/PAT0001'</pre>
<pre>
{
    "total_docs": 2,
    "procedures": [
        {
            "procedure_done": "General Checkup",
            "treatment_date": "2021-03-22T11:00:00.000Z",
            "remarks": null,
            "doctor": "Dr. Who",
            "teeth_number": [],
            "t_id": "TRT0001"
        },
        {
            "procedure_done": "Filling",
            "treatment_date": "2021-03-24T05:30:00.000Z",
            "remarks": null,
            "doctor": "Dr. Who",
            "teeth_number": [],
            "t_id": "TRT0002"
        }
    ],
    "doctors": [
        "Dr. Who"
    ],
    "last_visit": "2021-03-22T11:00:00.000Z"
}
</pre>
</details>

### Update Treatment
Update an existing treatment record
```
PUT /api/treatment/update/:tid
```
The request body should contain the changes to be made to the treatment record
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tid</td>
      <td>String</td>
      <td>The id of the treatment to update</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  p_id:               String,
  doctor:             String,
  procedure_done:     String,
  treatment_date:     Date,
  remarks:            String,
  teeth_number:       [ Number ],
  created_at:         Date
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request PUT 'http://127.0.0.1:8000/api/treatment/update/TRT0002' \
--header 'Content-Type: application/json' \
--data-raw '{
    "procedure_done": "Filling",
    "teeth_number": [
        19,
        20
    ],
    "remarks": "Checkup after a month",
    "doctor": "Dr. Who",
    "p_id": "PAT0001",
    "t_id": "TRT0002"
}'
</pre>
{
    "procedure_done": "Filling",
    "teeth_number": [
        19,
        20
    ],
    "remarks": "Checkup after a month",
    "doctor": "Dr. Who",
    "p_id": "PAT0001",
    "treatment_date": "2021-03-24T05:30:00.000Z",
    "t_id": "TRT0002",
    "created_at": "2021-04-27T17:51:18.643Z"
}
<pre>
</pre>
</details>

### Import Treatments
Import XLS file containing treatment records. Filename (present in `data/` folder) to be passed in request body.
```
PUT /api/treatment/import
```
#### Request Body
Required fields: **file**
```
{
  file:   String
}
```
#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      t_id:             String,
      p_id:             String,
      doctor:           String,
      procedure_done:   String
    }
  ]
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error

### Export Treatments
Export treatment records to XLS file. Exports into `data/Treatment List(Month YYYY).xls`.
```
GET /api/treatment/export/
```
#### Response
**Status 200**
```
{
  total_docs:   Number
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>curl --location --request GET 'http://127.0.0.1:8000/api/treatment/export/'</pre>
  <pre>
    {
      "total_docs": 2
    }
  </pre>
</details>

## Appointment
Here's a quick overview of all Appointment endpoints
```
POST /api/appointment/new
GET /api/appointment/all
GET /api/appointment/patient/:pid
POST /api/appointment/doctor/
PUT /api/appointment/update/:appid
```

### Create Appointment
Create a new appointment record
```
POST /api/appointment/new/
```
#### Request Body
Required fields: **p_id**, **doctor**, **appointment_date**
```
{
  p_id:               String,
  doctor:             String,
  appointment_date:   Date,
  status:             Number,
  room:               Number
}
```
#### Response
**Status 201**
```
{
  p_id:               String,
  doctor:             String,
  appointment_date:   Date,
  app_id:             String
}
```
**Status 400** Bad Request

**Status 409** Appointment not feasible

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request POST 'http://127.0.0.1:8000/api/appointment/new/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "p_id": "PAT0001",
    "doctor": "Dr. Who",
    "appointment_date": 1622286000,
    "status": 2
}'</pre>
<pre>
{
    "p_id": "PAT0001",
    "doctor": "Dr. Who",
    "appointment_date": 1622286000000,
    "status": 2,
    "app_id": "APP0001"
}
</pre>
</details>

### List Appointments
List all appointment records
```
GET /api/appointment/all/
```

Allowed Methods: GET, POST, PUT

#### Query Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>quick</td>
      <td>Boolean</td>
      <td>To filter and obtain a concise list</td>
    </tr>
    <tr>
      <td>from</td>
      <td>Date</td>
      <td>The from date to filter the list</td>
    </tr>
    <tr>
      <td>to</td>
      <td>Date</td>
      <td>The to date to filter the list</td>
    </tr>
    <tr>
      <td>count</td>
      <td>Boolean</td>
      <td>To fetch only the count of appointments</td>
    </tr>
  </tbody>
</table>

**Note:** The from & to parameters need to be applied together.

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      app_id:             String,
      p_id:               String,
      doctor:             String,
      appointment_date:   Date,
      status:             Number,
      room:               Number,
      created_at:         Date
    }
  ],
  meta:         [ Object ]
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>curl --location --request GET 'http://127.0.0.1:8000/api/appointment/all/'</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "status": 2,
            "p_id": "PAT0001",
            "doctor": "Dr. Who",
            "appointment_date": "2021-05-29T11:00:00.000Z",
            "app_id": "APP0001",
            "created_at": "2021-04-28T14:00:57.931Z"
        }
    ],
    "meta": [
        {
            "type": "doctor",
            "name": "Dr. Who",
            "count": 1
        },
        {
            "type": "status",
            "value": 2,
            "count": 1
        }
    ]
}
</pre>
</details>

<details>
<summary>Sample (by date)</summary>
<pre>
curl --location --request GET 'http://127.0.0.1:8000/api/appointment/all/?from=1622140200&to=1622312999'
</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "status": 2,
            "p_id": "PAT0001",
            "doctor": "Dr. Who",
            "appointment_date": "2021-05-29T12:00:00.000Z",
            "app_id": "APP0001",
            "created_at": "2021-04-28T14:00:57.931Z",
            "patient": {
                "name": "Taika Waititi",
                "age": 45,
                "gender": "M"
            }
        }
    ],
    "meta": [
        {
            "type": "doctor",
            "name": "Dr. Who",
            "count": 1
        },
        {
            "type": "status",
            "value": 2,
            "count": 1
        }
    ]
}
</pre>
</details>

### Get Appointments by Patient
Get the appointment records for a patient by patient id
```
GET /api/appointment/patient/:pid
```
#### Path Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pid</td>
      <td>String</td>
      <td>The id of the patient to fetch appointments</td>
    </tr>
  </tbody>
</table>

#### Query Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>count</td>
      <td>Boolean</td>
      <td>To fetch only the count of appointments</td>
    </tr>
  </tbody>
</table>

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      app_id:             String,
      p_id:               String,
      doctor:             String,
      appointment_date:   Date,
      status:             Number,
      room:               Number,
      created_at:         Date
    }
  ],
  meta:         [ Object ]
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request GET 'http://127.0.0.1:8000/api/appointment/patient/PAT0001'
</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "status": 2,
            "p_id": "PAT0001",
            "doctor": "Dr. Who",
            "appointment_date": "2021-05-29T11:00:00.000Z",
            "app_id": "APP0001",
            "created_at": "2021-04-28T14:00:57.931Z"
        }
    ]
}
</pre>
</details>

### Get Appointments by Doctor
Get the appointment records for a doctor
```
GET /api/appointment/doctor/
```
Allowed Methods: GET, POST, PUT

#### Query Parameters
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>doctor</td>
      <td>string</td>
      <td>The name of the doctor to fetch the appointments</td>
    </tr>
    <tr>
      <td>count</td>
      <td>Boolean</td>
      <td>To fetch only the count of appointments</td>
    </tr>
  </tbody>
</table>

**Note:** **Note:** If you are using POST or PUT methods, you can pass the *doctor* parameter in the request body.

#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      app_id:             String,
      p_id:               String,
      doctor:             String,
      appointment_date:   Date,
      status:             Number,
      room:               Number,
      created_at:         Date
    }
  ],
  meta:         [ Object ]
}
```
**Status 204** No data found

**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request POST 'http://127.0.0.1:8000/api/appointment/doctor/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "doctor": "Dr. Who"
}'
</pre>
<pre>
{
    "total_docs": 1,
    "docs": [
        {
            "status": 2,
            "p_id": "PAT0001",
            "doctor": "Dr. Who",
            "appointment_date": "2021-05-29T11:00:00.000Z",
            "app_id": "APP0001",
            "created_at": "2021-04-28T14:00:57.931Z"
        }
    ]
}
</pre>
</details>

### Update Appointment
Update an existing appointment record
```
PUT /api/appointment/update/APP0001
```
The request body should contain the changes to be made to the appointment record.

#### Response
**Status 200**
```
{
  app_id:             String,
  p_id:               String,
  doctor:             String,
  appointment_date:   Date,
  status:             Number,
  room:               Number,
  created_at:         Date
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
<summary>Sample</summary>
<pre>
curl --location --request PUT 'http://127.0.0.1:8000/api/appointment/update/APP0001' \
--header 'Content-Type: application/json' \
--data-raw '{
    "status": 2,
    "appointment_date": 1622289600
}'
</pre>
<pre>
{
    "status": 2,
    "p_id": "PAT0001",
    "doctor": "Dr. Who",
    "appointment_date": "2021-05-29T12:00:00.000Z",
    "app_id": "APP0001",
    "created_at": "2021-04-28T14:00:57.931Z"
}
</pre>
</details>

### Import Appointments
Import XLS file containing patient records. Filename (present in `data/` folder) to be passed in request body.
```
PUT /api/appointment/import
```
#### Request Body
Required fields: **file**
```
{
  file:   String
}
```
#### Response
**Status 200**
```
{
  total_docs:   Number,
  docs: [
    {
      app_id:             String,
      p_id:               String,
      doctor:             String,
      appointment_date:   Date
    }
  ]
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error

### Export Appointments
Export appointment records to XLS file. Exports into `data/Appointment List(Month YYYY).xls`.
```
GET /api/appointment/export/
```
#### Response
**Status 200**
```
{
  total_docs:   Number
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>curl --location --request GET 'http://127.0.0.1:8000/api/appointment/export/'</pre>
  <pre>
    {
      "total_docs": 1
    }
  </pre>
</details>

## Invoice
Here's a quick overview of all Invoice endpoints
```
POST /api/invoice/new
GET /api/invoice/all
GET /api/invoice/print/:invid
```

### Create Invoice
Create a new invoice record
```
POST /api/invoice/new
```
#### Request Body
Require fields: **p_id**, **treatments.doctor**, **treatments.procedure_done**
```
{
  p_id:   String,
  treatments: [
    {
      doctor:             String,
      procedure_done:     String,
      treatment_date:     Date,
      teeth_number:       [ Number ],
      cost:               Number,
      qty:                Number,
      total:              Number
    }
  ]
}
```
#### Response
**Status 201**
```
{
  p_id:         String,
  doctor:       [ String ],
  treatments:   [ String ],
  inv_id:       String
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>
    curl --location --request POST 'http://127.0.0.1:8000/api/invoice/new/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "p_id": "PAT0001",
        "treatments": [
            {
                "t_id": "TRT0001",
                "doctor": "Dr. Who",
                "cost": 1000,
                "qty": 1,
                "total": 1000
            },
            {
                "t_id": "TRT0002",
                "doctor": "Dr. Who",
                "cost": 1000,
                "qty": 1,
                "total": 1000
            }
        ],
        "payment_method": "Cash",
        "sub_total": 2000,
        "grand_total": 2000
    }'
  </pre>
  <pre>
    {
        "p_id": "PAT0001",
        "doctor": [
            "Dr. Who"
        ],
        "treatments": [
            "{\"t_id\":\"TRT0001\",\"doctor\":\"Dr. Who\",\"cost\":1000,\"qty\":1,\"total\":1000}",
            "{\"t_id\":\"TRT0002\",\"doctor\":\"Dr. Who\",\"cost\":1000,\"qty\":1,\"total\":1000}"
        ],
        "payment_method": "Cash",
        "sub_total": 2000,
        "grand_total": 2000,
        "inv_id": "INV0001"
    }
  </pre>
</details>

### List Invoices

<details>
  <summary>Sample</summary>
  <pre>curl --location --request GET 'http://127.0.0.1:8000/api/invoice/all/'</pre>
  <pre>
    {
        "total_docs": 1,
        "docs": [
            {
                "treatments": [
                    {
                        "t_id": "TRT0001",
                        "doctor": "Dr. Who",
                        "cost": 1000,
                        "qty": 1,
                        "total": 1000
                    },
                    {
                        "t_id": "TRT0002",
                        "doctor": "Dr. Who",
                        "cost": 1000,
                        "qty": 1,
                        "total": 1000
                    }
                ],
                "doctor": [
                    "Dr. Who"
                ],
                "p_id": "PAT0001",
                "payment_method": "Cash",
                "sub_total": 2000,
                "grand_total": 2000,
                "inv_id": "INV0001",
                "created_at": "2021-04-29T12:22:21.208Z"
            }
        ]
    }
  </pre>
</details>

### Print Invoice
```
GET /api/invoice/print/:invid
```
#### Path Parameter
<table>
  <thead>
    <tr>
      <th>
        Parameter
      </th>
      <th>
        Type
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>invid</td>
      <td>String</td>
      <td>The id of the invoice to print</td>
    </tr>
  </tbody>
</table>


#### Response
**Status 201**
```
{
  file:   String
}
```
**Status 400** Bad Request

**Status 500** Internal Server Error
<details>
  <summary>Sample</summary>
  <pre>curl --location --request GET 'http://127.0.0.1:8000/api/invoice/print/INV0001'</pre>
  <pre>
    {
      "file": "/home/USER/TDC/invoice/INV0001.pdf"
    }
  </pre>
</details>
