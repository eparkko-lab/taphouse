var suiteDetails;
var GSuiteName;

function getSuite(suiteName) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("testsuiteDetails").textContent = JSON.stringify(JSON.parse(this.responseText), null, 2);
      suiteDetails = JSON.parse(this.responseText);
      document.getElementById("totalTestCount").textContent = suiteDetails.tests.length;
      addEmptyRowsToTestDetailsTable();
    }
  };
  GSuiteName = suiteName;
  xhttp.open("GET", "https://xhbg5kpuu7.execute-api.us-east-2.amazonaws.com/p/suite/" + suiteName + "?client_id=yaN8bv3EOemBtWNVPEryZO67U0OFJ14l4DNEI640", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
}

function executeTests() {
  getSuite(GSuiteName);
  hide("verifiedResultsButton", false);
  hide("verifiedResults", false);
  
  sessionId = document.getElementById("sessionId")
      
  sessionId.value = uuidv4();
  
  var tests = suiteDetails.tests;
  var orderedTests = tests.sort((a, b) => (parseInt(a.sequence) > parseInt(b.sequence)) ? 1 : -1);
  var arrayLength = orderedTests.length;

  //deleteTableRows();
  const loopTests = async n => {

    for (var i = 0; i < n; i++) {
      console.log("processing test #:" + (i + 1) + " of: " + n);
      document.getElementById("currentTestCount").textContent = (i + 1);
      await processTest(orderedTests[i]);
    }
    hide("verifiedResultsButton", true);
    //hide("verifiedResults", true);
    return (console.log("complete"))

  }
  loopTests(arrayLength);

}

function getTestResults() {
  sessionId = document.getElementById("sessionId").value
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://xhbg5kpuu7.execute-api.us-east-2.amazonaws.com/p/verifyresults/" + sessionId + "?client_id=yaN8bv3EOemBtWNVPEryZO67U0OFJ14l4DNEI640", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
  xhttp.addEventListener("load", function () {
    if (xhttp.status < 400) {
      document.getElementById("verifiedResults").textContent = JSON.stringify(JSON.parse(this.responseText), null, 2);
      verifiedResults = JSON.parse(this.responseText);
      addResultsInfoToTestDetailsTable();
    } else {
      console.log(xhttp);
      console.log(xhttp.statusText);
      document.getElementById("verifiedResults").textContent = this.responseText;
    }
  });
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

    }
  };

}

function CheckQueryParams() {
  var url_string = window.location.href
  var url = new URL(url_string);
  testNameParam = url.searchParams.get("testName");
  //delayTypeParam = url.searchParams.get("delayType");
  currentHostName = window.location.hostname
  setInitialValues();
}

function setInitialValues() {
  //Override the rpid to wherever the site is hosted.
  document.getElementsByName("webAuthnRequestTypeMenu")[0].value = testNameParam;
  //document.getElementsByName("delayMenu")[0].value = delayTypeParam;
  getSuite(testNameParam);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function run(test) {

  await processTest(test);
  console.log("run complete");
  return;

}



var processTest = async function (test) {
  return new Promise((resolve, reject) => {
    var testDetails;
    var requestDetails;

    var retrieveTest = function (test) {
      return new Promise((resolve, reject) => {
        var req2 = new XMLHttpRequest();
        req2.open("GET", "https://xhbg5kpuu7.execute-api.us-east-2.amazonaws.com/p/test/" + test.testId + "?client_id=yaN8bv3EOemBtWNVPEryZO67U0OFJ14l4DNEI640", true);
        req2.setRequestHeader("Access-Control-Allow-Origin", "*");
        req2.setRequestHeader("Accept", "application/json");
        req2.setRequestHeader("Content-Type", "application/json");
        req2.addEventListener("load", function () {
          if (req2.status < 400) {
            document.getElementById("testDetails").textContent = JSON.stringify(JSON.parse(this.responseText), null, 2);
            testDetails = JSON.parse(this.responseText);
            console.log("test requestId: " + testDetails.requestId);
            resolve(testDetails);
          } else {
            reject(new Error("Request failed: " + req2.statusText));
          }
        });
        req2.addEventListener("error", function () {
          reject(new Error("Network error"));
        });
        req2.send();



      })
    }

    var getRequest = function (testDetails) {
      return new Promise((resolve, reject) => {
        console.log("testDetails:" + testDetails);
        var req3 = new XMLHttpRequest();

        req3.open("GET", "https://xhbg5kpuu7.execute-api.us-east-2.amazonaws.com/p/request/" + testDetails.requestId + "?client_id=yaN8bv3EOemBtWNVPEryZO67U0OFJ14l4DNEI640", true);
        req3.setRequestHeader("Access-Control-Allow-Origin", "*");
        req3.setRequestHeader("Accept", "application/json");
        req3.setRequestHeader("Content-Type", "application/json");
        req3.addEventListener("load", function () {
          if (req3.status < 400) {
            requestDetails = JSON.parse(this.responseText);
            addTestInfoToTestDetailsTable(testDetails.testId, testDetails.testName, testDetails.requestId, requestDetails.requestBase64, requestDetails.requestType)
            resolve(requestDetails)
          } else {
            reject(new Error("Request failed: " + req3.statusText));
          }
        });
        req3.addEventListener("error", function () {
          reject(new Error("Network error"));
        });
        req3.send();

      })
    }

  

    var buildWebAuthnRequest = function (requestDetails) {
      return new Promise((resolve, reject) => {
        decodedWebauthnRequest = atob(requestDetails.requestBase64);
        requestDetails["decodedWebauthnRequest"] = decodedWebauthnRequest;
        requestDetails["populatedWebAuthnRequest"] = decodedWebauthnRequest;
        //console.log("navigator.credentials." + requestDetails.requestType + "(" + requestDetails.requestBase64 + ")");  
        document.getElementById("webauthnRequestType").textContent = requestDetails.requestType;
        document.getElementById("webauthnRequest").textContent = JSON.stringify(JSON.parse(decodedWebauthnRequest), null, 2);
        resolve(requestDetails);

      })
    }

    var promptUser =  function (requestDetails) {
      let promise1 = new Promise((resolve, reject) => {
        
        testDetails = JSON.parse(document.getElementById("testDetails").textContent);
          message = "Press OK to execute next test:   " + testDetails.testName
          alert(message);
          resolve(requestDetails);
        
        //if (document.getElementsByName("delayMenu")[0].value === "prompts") {
          
        //} else {
        //  resolve(requestDetails);
       // }

      })
      return promise1
    }

    var sleep = function (ms) {
      return new Promise((resolve, reject) => {
        console.log("start sleep: " + ms + "ms");
        setTimeout(resolve, ms);
      }
      )
    }

    var executeWebAuthn = function (requestDetails) {
      let promise2 = new Promise((resolve, reject) => {
        if (requestDetails.requestType === "get") {
          authenticate();
          resolve()
        } else if (requestDetails.requestType === "create") {
          register();
          resolve();
        } else {
          reject();
        }
        return promise2
      })
    }
        
    //var delayRequest = async function (time) {
    //  return await new Promise((resolve, reject) => {
    //    if (document.getElementsByName("delayMenu")[0].value === "staticDelay") {
    //      sleep(time);
    //      resolve();
    //    } else {
    //      resolve();
    //    }
    //  })
    //}


    var postResult = function () {
      return new Promise((resolve, reject) => {
        var webAuthnResponse = btoa(document.getElementById("webauthnResponse").textContent);

        var req4 = new XMLHttpRequest();
        req4.open("POST", "https://xhbg5kpuu7.execute-api.us-east-2.amazonaws.com/p/result/?client_id=yaN8bv3EOemBtWNVPEryZO67U0OFJ14l4DNEI640", true);
        req4.setRequestHeader("Access-Control-Allow-Origin", "*");
        req4.setRequestHeader("Accept", "application/json");
        req4.setRequestHeader("Content-Type", "application/json");
        req4.addEventListener("load", function () {
          if (req4.status < 400) {
            testDetails = JSON.parse(this.responseText);
            console.log("posted results");
            resolve(testDetails);
          } else {
            reject(new Error("Request failed: " + req4.statusText));
          }
        });
        req4.addEventListener("error", function () {
          reject(new Error("Network error"));
        });

        result = {
          sessionId: document.getElementById("sessionId").value,
          webauthnRequest: btoa(requestDetails["populatedWebAuthnRequest"]),
          webauthnResponse: webAuthnResponse,
          userAgent: navigator.userAgent,
          suiteName: suiteDetails.suiteName,
          testId: testDetails.testId,
          resultId: ""
        }
        console.log("post: " + JSON.stringify(result));
        req4.send(JSON.stringify(result));

      }
      )
    }
    retrieveTest(test)
      .then(function (testDetails) {
        return getRequest(testDetails);
      })
      .then(function (requestDetails) {
        return buildWebAuthnRequest(requestDetails);
      })
      .then(function (testDetails) {
        return promptUser(testDetails);
      })
      .then(function (requestDetails) {
        return executeWebAuthn(requestDetails);
      })
      .then(function () {
        return sleep(8000);
      })
      .then(function () {
        return postResult();
      })
      .then(function () {
        resolve("done");
      })
                 
    //.then(sleep(100))      
      

  })
}





