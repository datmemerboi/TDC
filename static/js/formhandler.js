function showForm(updateOption) {
  ColumnToUpdate = updateOption;
  let container = document.getElementById('update-form-container');
  let i = 0;
  while(container.childNodes.length>0){
    container.removeChild( container.childNodes[i] );
  }
  switch (updateOption) {
    case 'Name':
      NameFrom(); break;
    case 'Phone No':
      PhoneForm(); break;
    case 'Age':
      AgeForm(); break;
    case 'Sex':
      SexForm(); break;
    case 'Treatment Date':
      TreatmentDateForm(); break;
    case 'Provisional Diagnosis':
      ProvDiagForm(); break;
    case 'Investigations':
      InvestigationsForm(); break;
    case 'Final Diagnosis':
      FinalDiagForm(); break;
    case 'Treatment':
      TreatmentForm(); break;
    case 'Result':
      ResultForm(); break;
    case 'Next Appointment':
      NextAppointmentForm(); break;
    case 'Additional Information':
      AddInfoForm(); break;
    default:
      console.log("How did you input that?");

  }
}

function submission() {
  if(FromRecord.Name === undefined ) {
    alert("Choose record to update..");
  }
  else{
    console.log(FromRecord);
    ToRecord[ColumnToUpdate] = document.getElementById('updation-form').elements.namedItem("updatedpatient["+ColumnToUpdate+"]").value;
    $.post('http://localhost:9090/updation', {FromRecord, ToRecord},(res)=>{
      if(res==="Accepted"){
        alert("Updated");
      }
      else {
        alert("Some issue arised..");
        console.log(res);
      }
    });
  }
}
