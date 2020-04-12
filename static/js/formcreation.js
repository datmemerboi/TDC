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
  var maleInput = document.createElement('INPUT');
  maleInput.setAttribute('type', 'radio');
  maleInput.setAttribute('name', 'updatedpatient[Sex]');
  maleInput.setAttribute('value', 'Male');
  var maleLabel = document.createElement('LABEL');
  maleLabel.setAttribute('for', 'Male');
  maleLabel.innerHTML = "Male";

  var femaleInput = document.createElement('INPUT');
  femaleInput.setAttribute('type', 'radio');
  femaleInput.setAttribute('name', 'updatedpatient[Sex]');
  femaleInput.setAttribute('value', 'Female');
  var femaleLabel = document.createElement('LABEL');
  femaleLabel.setAttribute('for', 'Female');
  femaleLabel.innerHTML = "Female";

  var otherInput = document.createElement('INPUT');
  otherInput.setAttribute('type', 'radio');
  otherInput.setAttribute('name', 'updatedpatient[Sex]');
  otherInput.setAttribute('value', 'Other');
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
  form.appendChild(maleInput); form.appendChild(maleLabel);
  form.appendChild(femaleInput); form.appendChild(femaleLabel);
  form.appendChild(otherInput); form.appendChild(otherLabel);

  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}
function TreatmentDateForm() {
    var inputBox = document.createElement('INPUT');
    inputBox.setAttribute('type', 'date');
    inputBox.setAttribute('name', 'updatedpatient[Treatment-Date]');
    inputBox.setAttribute('class', 'update-input');
    var dateLabel = document.createElement('LABEL');
    dateLabel.setAttribute('for','updatedpatient[Treatment-Date]');
    dateLabel.innerHTML = 'Date of latest treatment';

    var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
    var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');
    var br3 = document.createElement('BR'); br3.setAttribute('class', 'no-select');

    var updateBtn = document.createElement('BUTTON');
    updateBtn.setAttribute('type', 'button')
    updateBtn.setAttribute('class', 'update-submit');
    updateBtn.setAttribute('onclick', 'submission()');
    updateBtn.innerHTML = "UPDATE";

    var form = createForm();
    form.appendChild(dateLabel);
    form.appendChild(br3);
    form.appendChild(inputBox);
    form.appendChild(br1); form.appendChild(br2);
    form.appendChild(updateBtn);

    container.appendChild(form);
}
function MedHistoryForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Med-History]');
  inputBox.setAttribute('placeholder', 'Medical History');
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

function CurrentMedsForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', 'updatedpatient[Current-Meds]');
  inputBox.setAttribute('placeholder', 'Current Medication');
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

function NextTreamentForm() {
  var inputBox = document.createElement('INPUT');
  inputBox.setAttribute('type', 'date');
  inputBox.setAttribute('name', 'updatedpatient[Next-Treatment]');
  inputBox.setAttribute('class', 'update-input');
  var dateLabel = document.createElement('LABEL');
  dateLabel.setAttribute('for','updatedpatient[Next-Treatment]');
  dateLabel.innerHTML = 'Date of next treatment';

  var br1 = document.createElement('BR'); br1.setAttribute('class', 'no-select');
  var br2 = document.createElement('BR'); br2.setAttribute('class', 'no-select');
  var br3 = document.createElement('BR'); br3.setAttribute('class', 'no-select');

  var updateBtn = document.createElement('BUTTON');
  updateBtn.setAttribute('type', 'button')
  updateBtn.setAttribute('class', 'update-submit');
  updateBtn.setAttribute('onclick', 'submission()');
  updateBtn.innerHTML = "UPDATE";

  var form = createForm();
  form.appendChild(dateLabel);
  form.appendChild(br3);
  form.appendChild(inputBox);
  form.appendChild(br1); form.appendChild(br2);
  form.appendChild(updateBtn);

  container.appendChild(form);
}
