function hide(divName, on) {
  var x = document.getElementById(divName);
  if (on === true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

}

function deleteTableRows() {
  var table = document.getElementById("testDetailsTable");
  rowCount = table.rows.length;
  console.log(rowCount);

  //Remove all the rows from the table
  for (var i = 1; i < rowCount; i++) {
    table.deleteRow(1);
  }
}

function addTestIdListToTable() {
  testSuiteDetails = JSON.parse(document.getElementById("testsuiteDetails").innerHTML);

  for (var i = 0; i < testSuiteDetails.tests.length; i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0).innerHTML = testSuiteDetails.tests[i].testId;
  }

}

function addEmptyRowsToTestDetailsTable() {
  deleteTableRows();
  addTestIdListToTable();
}

function populateTestDetails(){
  var table = document.getElementById("testDetailsTable");

  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i]
    var rowTestId = row.cells[0].innerHTML

    if (rowTestId === testId) {
      row.insertCell(1).innerHTML = testName;
      row.insertCell(2).innerHTML = '<a href="https://eparkko-lab.github.io/webauthn-playground?requestType=' + requestType + '&webauthnRequest=' + request + '"target="_blank">' + requestId + '</a>';
    }
  }

}

function addTestInfoToTestDetailsTable(testId, testName, requestId, request, requestType) {
  
  deleteTableRows();
  addTestIdListToTable();
  populateTestDetails();
  
}


function addResultsInfoToTestDetailsTable() {
  deleteTableRows();
  addTestIdListToTable();
  populateTestDetails();

  var table = document.getElementById("testDetailsTable");
  verifiedResultsDict = JSON.parse(document.getElementById("verifiedResults").innerHTML)

  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var rowTestId = row.cells[0].innerHTML;
    console.log("beginning testId: " + rowTestId)
    var j = 1;
    for (var key in verifiedResultsDict[rowTestId]["assertions"]) {
      //Add the details to the following rows since there are many results per test
      resultsRowNumber = i + j;
      console.log("  resultsRowNumber: " + resultsRowNumber);
      resultsRow = table.insertRow(resultsRowNumber);
      //resultsRow = table.rows[resultsRowNumber];


      resultsCell = resultsRow.insertCell(0);
      resultsCell.innerHTML = "-";
      resultsCell.style.color = "black";
      resultsCell = resultsRow.insertCell(1);
      resultsCell.innerHTML = "-";
      resultsCell.style.color = "black";
      resultsCell = resultsRow.insertCell(2);
      resultsCell.innerHTML = "-";
      resultsCell.style.color = "black";
      resultsCell = resultsRow.insertCell(3);
      resultsCell.innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].assertionField;;
      resultsCell.style.color = "black";
      resultsCell = resultsRow.insertCell(4);
      resultsCell.innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].expectedValue;
      resultsCell.style.color = "black";
      resultsCell = resultsRow.insertCell(5);
      resultsCell.innerHTML = verifiedResultsDict[rowTestId]["assertions"][key].status;
      resultsCell.style.color = "black";
      if (resultsCell.innerHTML === "PASS") {
        resultsCell.style.backgroundColor = "green";
      } else {
        resultsCell.style.backgroundColor = "red";
      }
      j++;
    }
    console.log("finished: " + rowTestId);
    console.log("table length: " + table.rows.length)
    i = resultsRowNumber;
    console.log("i: " + i);
  }


}