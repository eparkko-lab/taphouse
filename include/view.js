function hide(divName, on) {
  var x = document.getElementById(divName);
  if (on === true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

}

function addEmptyRowsToTestDetailsTable() {
  var table = document.getElementById("testDetailsTable");
  rowCount = table.rows.length;

  //Remove all the rows from the table
  for (var i = 1; i < rowCount; i++) {
    table.deleteRow(i);
  }

  testSuiteDetails = document.getElementById("testsuiteDetails");
  for (var i = 0; i < testSuiteDetails.tests.length; i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0).innerHTML = testSuiteDetails.tests[i].testId;
  }


}