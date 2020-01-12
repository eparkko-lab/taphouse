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

  testSuiteDetails = JSON.parse(document.getElementById("testsuiteDetails").innerHTML);
  //testSuiteDetails = { "tests": [{ "sequence": "1", "testId": "t1" }, { "sequence": "2", "testId": "t2" }], "suiteName": "defaultValuesGetAndCreate" }

  for (var i = 0; i < testSuiteDetails.tests.length; i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0).innerHTML = testSuiteDetails.tests[i].testId;
  }


}

function addTestInfoToTestDetailsTable(testId, testName, requestId) {
  var table = document.getElementById("testDetailsTable");
  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i]
    var rowTestId = row.cells[0].innerHTML

    if (rowTestId === testId) {
      row.insertCell(1).innerHTML = testName;
      row.insertCell(2).innerHTML = requestId;
    }
  }
}


function addResultsInfoToTestDetailsTable() {
  var table = document.getElementById("testDetailsTable");
  verifiedResultsDict = JSON.parse(document.getElementById("verifiedResults").innerHTML)
  //verifiedResultsDict={"t1": {  "testName": "defaultCreate", "requestId": "r1", "assertions": { "a1": { "comparisonType": "equals", "assertionId": "a1", "assertionField": "{parsedResponse.attestationObject}(fmt)", "expectedValue": "packed", "status": "PASS" }, "a3": { "comparisonType": "equals", "assertionId": "a3", "assertionField": "{parsedResponse.clientDataJSON.type}", "expectedValue": "webauthn.create", "status": "PASS"}} },
  //  "t2": { "testName": "defaultGet", "requestId": "r2", "assertions": {   "a2": {     "comparisonType": "equals",     "assertionId": "a2",     "assertionField": "{parsedResponse.clientDataJSON.type}",     "expectedValue": "webauthn.get",     "status": "PASS"   } }    }  }

  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var rowTestId = row.cells[0].innerHTML;
    var j = 1;
    for (var key in verifiedResultsDict[rowTestId]["assertions"]) {
      //Add the details to the following rows since there are many results per test
      resultsRowNumber = i + j;
      console.log("  resultsRowNumber: " + resultsRowNumber);
      resultsRow = table.insertRow(resultsRowNumber);
      //resultsRow = table.rows[resultsRowNumber];
      resultsRow.insertCell(0).innerHTML = "---";
      resultsRow.insertCell(1).innerHTML = "---";
      resultsRow.insertCell(2).innerHTML = "---";
      resultsRow.insertCell(3).innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].assertionField;
      resultsRow.insertCell(4).innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].expectedValue;
      resultsRow.insertCell(5).innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].status;
      j++;
    }
    i = resultsRowNumber + 1;
  }


}