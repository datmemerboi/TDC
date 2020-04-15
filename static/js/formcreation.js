let container = document.getElementById('update-form-container');

function createForm(){
  var form = document.createElement('FORM');
  form.setAttribute('method', 'POST');
  form.setAttribute('class', 'updationForm');
  form.setAttribute('id', 'updation-form');
  return form;
}

function NameFrom() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Name]');
  inputBox.setAttribute('placeholder', 'Name');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function PhoneForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'tel');
  inputBox.setAttribute('name', 'updatedpatient[Phone No]');
  inputBox.setAttribute('placeholder', 'Phone No.');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function AgeForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'number');
  inputBox.setAttribute('name', 'updatedpatient[Age]');
  inputBox.setAttribute('min', '1');
  inputBox.setAttribute('placeholder', 'Age');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function SexForm(){
  var maleOption = document.createElement('INPUT');
  maleOption.setAttribute('type', 'radio');
  maleOption.setAttribute('name', 'updatedpatient[Sex]');
  maleOption.setAttribute('value', 'Male');
  var maleLabel = document.createElement('LABEL');
  maleLabel.setAttribute('for', 'Male');
  maleLabel.innerHTML = "Male";

  var femaleOption = document.createElement('INPUT');
  femaleOption.setAttribute('type', 'radio');
  femaleOption.setAttribute('name', 'updatedpatient[Sex]');
  femaleOption.setAttribute('value', 'Female');
  var femaleLabel = document.createElement('LABEL');
  femaleLabel.setAttribute('for', 'Female');
  femaleLabel.innerHTML = "Female";

  var otherOption = document.createElement('INPUT');
  otherOption.setAttribute('type', 'radio');
  otherOption.setAttribute('name', 'updatedpatient[Sex]');
  otherOption.setAttribute('value', 'Other');
  var otherLabel = document.createElement('LABEL');
  otherLabel.setAttribute('for', 'Other');
  otherLabel.innerHTML = "Other";

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();

  form.appendChild(maleOption); form.appendChild(maleLabel);
  form.appendChild(femaleOption); form.appendChild(femaleLabel);
  form.appendChild(otherOption); form.appendChild(otherLabel);

  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function TreatmentDateForm() {
    var inputBox = document.createElement('INPUT');
    inputBox.setAttribute('type', 'date');
    inputBox.setAttribute('name', 'updatedpatient[Treatment Date]');
    inputBox.setAttribute('class', 'update-input update-input-date');

    var dateLabel = document.createElement('LABEL');
    dateLabel.setAttribute('for','updatedpatient[Treatment Date]');
    dateLabel.innerHTML = 'Date of latest treatment';

    var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
    var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

    var updateBtn = document.createElement('BUTTON');
    updateBtn.setAttribute('type', 'button')
    updateBtn.setAttribute('class', 'update-submit');
    updateBtn.setAttribute('onclick', 'submission()');
    updateBtn.innerHTML = "UPDATE";

    var form = createForm();
    form.appendChild(dateLabel);
    form.appendChild(inputBox);
    form.appendChild(br1); form.appendChild(br2);
    form.appendChild(updateBtn);

    container.appendChild(form);
}

function ProvDiagForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Provisional Diagnosis]');
  inputBox.setAttribute('placeholder', 'Provisional Diagnosis');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function InvestigationsForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Investigations]');
  inputBox.setAttribute('placeholder', 'Investigations');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function FinalDiagForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Final Diagnosis]');
  inputBox.setAttribute('placeholder', 'Final Diagnosis');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function TreatmentForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Treatment]');
  inputBox.setAttribute('placeholder', 'Treatment Done');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function ResultForm() {
  var curedOption = document.createElement('OPTION');
  curedOption.setAttribute('value', 'Cured');
  curedOption.innerHTML = "Cured";
  var sameOption = document.createElement('OPTION');
  sameOption.setAttribute('value', 'Same Condition');
  sameOption.innerHTML = "Same Condition";
  var referOption = document.createElement('OPTION');
  referOption.setAttribute('value', 'Referred');
  referOption.innerHTML = "Referred";
  var expireOption = document.createElement('OPTION');
  expireOption.setAttribute('value', 'Expired');
  expireOption.innerHTML = "Expired";

  var selectBox = document.createElement('SELECT');
  selectBox.setAttribute('class', 'update-input update-input-select');
  selectBox.setAttribute('name', 'updatedpatient[Result]');
  selectBox.appendChild(curedOption); selectBox.appendChild(sameOption); selectBox.appendChild(referOption); selectBox.appendChild(expireOption);

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(selectBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);

}

function NextAppointmentForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'date');
  inputBox.setAttribute('name', 'updatedpatient[Next Appointment]');
  inputBox.setAttribute('class', 'update-input update-input-date');

  var dateLabel = document.createElement('LABEL');
  dateLabel.setAttribute('for','updatedpatient[Next Appointment]');
  dateLabel.innerHTML = 'Date of next treatment';

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(dateLabel);
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}

function AddInfoForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Additional Information]');
  inputBox.setAttribute('placeholder', 'Additional Information');
  inputBox.setAttribute('class', 'update-input');

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}


TreatmentForm
