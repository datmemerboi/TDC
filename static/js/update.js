function toUpdate(patientName) {
  $.post("http://localhost:9090/showdata", {}, (data)=>{
    data.forEach((record)=>{
      if(record.Name==patientName){
        var row = document.createElement('TR');

        var name = document.createElement('TD');
        name.innerHTML = record.Name;
        var age = document.createElement('TD');
        age.innerHTML = record.Age;
        var sex = document.createElement('TD');
        sex.innerHTML = record.Sex;
        var treatmentDate = document.createElement('TD');
        treatmentDate.innerHTML = record['Treatment-Date'];
        var medHist = document.createElement('TD');
        medHist.innerHTML = record['Med-History'];
        var treatement = document.createElement('TD');
        treatement.innerHTML = record.Treatment;
        var currentMeds = document.createElement('TD');
        currentMeds.innerHTML = record['Current-Meds'];
        var nextTreatment = document.createElement('TD');
        nextTreatment.innerHTML = record['Next-Treatment'];

        var radio = document.createElement('INPUT');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'selection');
        radio.setAttribute('onmouseup', 'recordChoice(this)');

        var recordChoice = document.createElement('TD');
        recordChoice.appendChild(radio);

        row.appendChild(recordChoice);
        row.appendChild(name); row.appendChild(age); row.appendChild(sex);
        row.appendChild(treatmentDate);row.appendChild(medHist);row.appendChild(treatement);
        row.appendChild(currentMeds);row.appendChild(nextTreatment);

        document.getElementById('update-table-body').appendChild(row);
      }
    });
  });
}
var UpdatedRecord = {};
function recordChoice(selection) {
  var tableRow = selection.parentNode.parentNode;
  UpdatedRecord.Name = tableRow.childNodes[1].innerHTML;
  UpdatedRecord.Age = tableRow.childNodes[2].innerHTML;
  UpdatedRecord.Sex = tableRow.childNodes[3].innerHTML;
  UpdatedRecord['Treatment-Date'] = tableRow.childNodes[4].innerHTML;
  UpdatedRecord['Med-History'] = tableRow.childNodes[5].innerHTML;
  UpdatedRecord.Treatment = tableRow.childNodes[6].innerHTML;
  UpdatedRecord['Current-Meds'] = tableRow.childNodes[7].innerHTML;
  UpdatedRecord['Next-Treatment'] = tableRow.childNodes[8].innerHTML;

  console.log(UpdatedRecord);
}
function showForm(updateOption) {
  console.log(updateOption);
}
