function showDate() {
  var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  var monthYYYY = months[new Date().getMonth()]+" "+(new Date().getFullYear());
  document.getElementById('date-td').innerHTML = monthYYYY;
  document.getElementById('modal-date-filename').innerHTML = monthYYYY;
}
window.onload= ()=>{
  showDate();
  $.post('http://localhost:9090/showData', {},(data)=>{
      data.forEach((record, index) => {
        var row = document.createElement("TR");

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
        var investigation = document.createElement('TD');
        investigation.innerHTML = record['Investigations'];
        var finalDiag = document.createElement('TD');
        finalDiag.innerHTML = record['Final Diagnosis'];
        var treatment = document.createElement('TD');
        treatment.innerHTML = record.Treatment;
        var result = document.createElement('TD');
        result.innerHTML = record['Result'];
        var nextDate = document.createElement('TD');
        nextDate.innerHTML = record['Next Appointment'];
        var addInfo = document.createElement('TD');
        addInfo.innerHTML = record['Additional Information'];

        row.appendChild(name); row.appendChild(phone); row.appendChild(age);
        row.appendChild(sex); row.appendChild(treatmentDate); row.appendChild(provDiag);
        row.appendChild(investigation); row.appendChild(finalDiag); row.appendChild(treatment);
        row.appendChild(result); row.appendChild(nextDate); row.appendChild(addInfo);

        document.getElementById('patient-table-body').appendChild(row);
      });

 })
};
function makingSure() {
  document.getElementById('modal-container').style.display = "block";
}
function cancelExport() {
  document.getElementById('modal-container').style.display = "none";
}
function exportFn() {
  $.get("http://localhost:9090/monthlyExport", {}, (res)=>{
    switch (res) {
      case "Accepted":
        alert("Exported!");
        window.location.href = "/";
        break;
      case "Null Data":
        alert("No data to export!");
        break;
      default:
        console.log(res);
        alert("Some error has occured.");
    }
  });
};
