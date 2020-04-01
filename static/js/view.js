window.onload= ()=>{
  $.post('http://localhost:9090/showdata', {},(data)=>{
      data.forEach((record, index) => {
        var row = document.createElement("TR");

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

        row.appendChild(name); row.appendChild(age); row.appendChild(sex);
        row.appendChild(treatmentDate);row.appendChild(medHist);row.appendChild(treatement);
        row.appendChild(currentMeds);row.appendChild(nextTreatment);

        document.getElementById('patient-table').appendChild(row);
      });
      
 })
};
