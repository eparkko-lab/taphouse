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
  console.log(rowCount);

  //Remove all the rows from the table
  for (var i = 1; i < rowCount; i++) {
    table.deleteRow(1);
  }

  //testSuiteDetails = document.getElementById("testsuiteDetails").innerHTML;
  //testSuiteDetails={
  //  "tests": [
  //    {
  //      "sequence": "1",
  //      "testId": "t1"
  //    },
  //    {
  //      "sequence": "2",
  //      "testId": "t2"
  //    }
  //  ],
  //  "suiteName": "defaultValuesGetAndCreate"
  //}

  for (var i = 0; i < testSuiteDetails.tests.length; i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0).innerHTML = testSuiteDetails.tests[i].testId;
  }


}

function addTestInfoToTestDetailsTable(testId, testName, requestId) {
  var table = document.getElementById("testDetailsTable");
  
  for (var i = 0; i < table.rows.length; i++) {
    var rowTestId = table.row[i].cell[0].innerHTML
    if (rowTestId === testId)
      row.insertCell(1).innerHTML = testName;
      row.insertCell(2).innerHTML = requestId;
  }


}
