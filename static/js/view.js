window.onload= ()=>{
  $.post('http://localhost:9090/showdata', {},(data)=>{
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
