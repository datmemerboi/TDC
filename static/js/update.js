document.getElementById('patient-name').addEventListener('keyup', (event)=>{
  if(event.keycode>=48 && event.keyCode<=57 || event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode==8)
  {
    clearTable();
    toUpdate(document.getElementById('patient-name').value);
  }

});

function clearTable() {
  var table = document.getElementById('update-table-body');
  while(table.firstElementChild) {
    table.removeChild( table.firstElementChild );
  }
}

function toUpdate(patientName) {
  $.post("http://localhost:9090/showData", {}, (data)=>{
    data.forEach((record)=>{
      if(record.Name==patientName){
        var row = document.createElement('TR');

        var name = document.createElement('TD');
        name.innerHTML = record.Name;
        var phone = document.createElement('TD');
        phone.innerHTML = record['Phone No'];
        var age = document.createElement('TD');
        age.innerHTML = record.Age;
        var sex = document.createElement('TD');
        sex.innerHTML = record.Sex;
        var treatmentDate = document.createElement('TD');
        treatmentDate.innerHTML = record['Treatment Date'];
        var provDiag = document.createElement('TD');
        provDiag.innerHTML = record['Provisional Diagnosis'];
        var invest = document.createElement('TD');
        invest.innerHTML = record.Investigations;
        var finalDiag = document.createElement('TD');
        finalDiag.innerHTML = record['Final Diagnosis'];
        var treatement = document.createElement('TD');
        treatement.innerHTML = record.Treatment;
        var result = document.createElement('TD');
        result.innerHTML = record.Result;
        var nextAppoint = document.createElement('TD');
        nextAppoint.innerHTML = record['Next Appointment'];
        var addInfo = document.createElement('TD');
        addInfo.innerHTML = record['Additional Information'];

        var select = document.createElement('INPUT');
        select.setAttribute('type', 'radio');
        select.setAttribute('name', 'selection');
        select.setAttribute('onmouseup', 'recordChoice(this)');

        var selectTab = document.createElement('TD');
        selectTab.appendChild(select);

        row.appendChild(selectTab);
        row.appendChild(name); row.appendChild(phone); row.appendChild(age); row.appendChild(sex);
        row.appendChild(treatmentDate);row.appendChild(provDiag);row.appendChild(invest);
        row.appendChild(finalDiag); row.appendChild(treatement); row.appendChild(result);
        row.appendChild(nextAppoint); row.appendChild(addInfo);

        document.getElementById('update-table-body').appendChild(row);
      }
    });
  });
}

var FromRecord = {}; var ToRecord = {}; var ColumnToUpdate = null;

function recordChoice(selection) {
  var tableRow = selection.parentNode.parentNode;

  FromRecord.Name = tableRow.childNodes[1].innerHTML;
  FromRecord['Phone No'] = tableRow.childNodes[2].innerHTML;
  FromRecord.Age = tableRow.childNodes[3].innerHTML;
  FromRecord.Sex = tableRow.childNodes[4].innerHTML;
  FromRecord['Treatment Date'] = tableRow.childNodes[5].innerHTML;
  FromRecord['Provisional Diagnosis'] = tableRow.childNodes[6].innerHTML;
  FromRecord.Investigations = tableRow.childNodes[7].innerHTML;
  FromRecord['Final Diagnosis'] = tableRow.childNodes[8].innerHTML;
  FromRecord.Treatment = tableRow.childNodes[9].innerHTML;
  FromRecord.Result = tableRow.childNodes[10].innerHTML;
  FromRecord['Next Appointment'] = tableRow.childNodes[11].innerHTML;
  FromRecord['Additional Information'] = tableRow.childNodes[12].innerHTML;

}
