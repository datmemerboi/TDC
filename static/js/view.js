window.onload= ()=>{
  $.get('http://localhost:9090/data', {},(data)=>{
      console.log(data);
      data.forEach((value, index) => {
        // console.log(value)
        var row = document.createElement("TR");

        var name = document.createElement('TD');
        name.innerHTML = value.Name;
        var age = document.createElement('TD');
        age.innerHTML = value.Age;
        var sex = document.createElement('TD');
        sex.innerHTML = value.Sex;

        row.appendChild(name); row.appendChild(age); row.appendChild(sex);

        document.getElementById('patient-table').appendChild(row);
      });
 })
};
