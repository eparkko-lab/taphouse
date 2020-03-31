function replaceMarkers(request) {
  //request = JSON.parse(request);
  var builtRequest = JSON.parse(request);

  if (builtRequest.allowCredentials &&
    builtRequest.allowCredentials[0] &&
    builtRequest.allowCredentials[0].id === "${lastGeneratedId}") {
    builtRequest.allowCredentials[0].id = localStorage.getItem('registeredCredentialId');
  }

  if (builtRequest.excludeCredentials &&
    builtRequest.excludeCredentials[0] &&
    builtRequest.excludeCredentials[0].id === "${lastGeneratedId}") {
    builtRequest.excludeCredentials[0].id = localStorage.getItem('registeredCredentialId');
  }
  return builtRequest;
}

function getWebAuthnRequest(builderArea) {
  var Request = document.getElementById(builderArea).value;
  return JSON.parse(Request);
}

function authenticate() {
  webAuthnRequest = getWebAuthnRequest("webauthnRequest");
  webAuthnRequest = replaceMarkers(JSON.stringify(webAuthnRequest));

  var webAuthnResponseDiv = document.getElementById("webauthnResponse");

  getAssertion(webAuthnRequest)
    .then(function (getAssertionResponse) {
      console.log(getAssertionResponse);
      webAuthnResponseDiv.textContent = JSON.stringify(responseToObject(getAssertionResponse), null, 2);
    })
    .catch(error => {
      webAuthnResponseDiv.textContent = error;
      throw error;
    })
}

async function getAssertion(webAuthnRequest) {
  console.log('Get assertion', webAuthnRequest);
  return await navigator.credentials.get({
    publicKey: decodePublicKeyCredentialRequestOptions(webAuthnRequest),
  });
}


function decodePublicKeyCredentialRequestOptions(webAuthnRequest) {
  //allowCredentials = webAuthnRequest.allowCredentials;
  const allowCredentials = webAuthnRequest.allowCredentials && webAuthnRequest.allowCredentials.map(credential => extend(
    credential, {
    id: toByteArray(credential.id),
  }));

  const publicKeyCredentialRequestOptions = extend(
    webAuthnRequest, {
    allowCredentials,
    challenge: toByteArray(webAuthnRequest.challenge),
  });
  console.log(publicKeyCredentialRequestOptions);
  var webAuthnRequestDiv = document.getElementById("webauthGetRequest");

  //webAuthnRequestDiv.textContent = JSON.stringify(publicKeyCredentialRequestOptions);

  return publicKeyCredentialRequestOptions;
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
function register() {
  webAuthnRequest = getWebAuthnRequest("webauthnRequest");
  webAuthnRequest = replaceMarkers(JSON.stringify(webAuthnRequest));

  var webAuthnResponseDiv = document.getElementById("webauthnResponse");

  createCredential(webAuthnRequest)
    .then(function (createCredentialResponse) {
      console.log("createCredential:" + createCredentialResponse);
      //console.log(JSON.stringify(createCredentialResponse.response.attestationObject));
      //decodedAttestation = decodeAttestationObj(createCredentialResponse.response.attestationObject);
      //createCredentialResponse.response.attestationObject = JSON.parse(decodedAttestation);
      webAuthnResponseDiv.textContent = JSON.stringify(responseToObject(createCredentialResponse), null, 2);
      localStorage.setItem('registeredCredentialId', createCredentialResponse.id)
      console.log(createCredentialResponse.id)
      //addCredentialIdToOptions("excludeCredentialsIdCreateMenu", createCredentialResponse.id)
      //addCredentialIdToOptions("allowCredentialsIdGetMenu", createCredentialResponse.id)
    })

    .catch(error => {
      console.log("error:" + error);
      webAuthnResponseDiv.textContent = error;
      //writeHistory("create", webAuthnRequest, error, updatedUrl)
      throw error;
    })

}

function writeHistory(historyType, request, response, url) {
  historyArea = document.getElementById("historyArea")
  historyArea.textContent =
    "\n-------"
    + historyType
    + " Request--" + Date() + "------------------------\n"
    + "url:\n "
    + url
    + "\n\nrequest:\n "
    + JSON.stringify(request)
    + "\n\nresponse:\n "
    + response
    + "\n\n---------------------------------\n"
    + historyArea.value;
}

async function createCredential(request) {
  return await navigator.credentials.create({
    publicKey: decodePublicKeyCredentialCreationOptions(request)
  });
}

function decodePublicKeyCredentialCreationOptions(request) {
  const excludeCredentials = request.excludeCredentials && request.excludeCredentials.map(credential => extend(
    credential, {
    id: toByteArray(credential.id),
  }));

  const publicKeyCredentialCreationOptions = extend(
    request, {
    attestation: request.attestation,
    user: extend(
      request.user, {
      id: toByteArray(request.user.id),
    }),
    challenge: toByteArray(request.challenge),
    excludeCredentials
  });

  var webAuthnRequestDiv = document.getElementById("webauthCreateRequest");

  //webAuthnRequestDiv.textContent = JSON.stringify(publicKeyCredentialCreationOptions);

  return publicKeyCredentialCreationOptions;
}





//--------------------------------------------------------------
function decodeAttestationObj(attestationObject) {
  return attestationObjectDecoded;
}

function extend(obj, more) {
  return Object.assign({}, obj, more);
}

function toByteArray(code) {
  return base64js.toByteArray(base64UrlToMime(code));
}

function base64UrlToMime(code) {
  return code.replace(/-/g, '+').replace(/_/g, '/') + '===='.substring(0, (4 - (code.length % 4)) % 4);
}

function responseToObject(response) {
  if (response.u2fResponse) {
    return response;
  } else {
    let clientExtensionResults = {};

    try {
      clientExtensionResults = response.getClientExtensionResults();
    } catch (e) {
      console.error('getClientExtensionResults failed', e);
    }

    if (response.response.attestationObject) {
      return {
        type: response.type,
        id: response.id,
        response: {
          attestationObject: fromByteArray(response.response.attestationObject),
          clientDataJSON: fromByteArray(response.response.clientDataJSON),
        },
        clientExtensionResults,
      };
    } else {
      return {
        type: response.type,
        id: response.id,
        response: {
          authenticatorData: fromByteArray(response.response.authenticatorData),
          clientDataJSON: fromByteArray(response.response.clientDataJSON),
          signature: fromByteArray(response.response.signature),
          userHandle: response.response.userHandle && fromByteArray(response.response.userHandle),
        },
        clientExtensionResults,
      };
    }
  }
}

function mimeBase64ToUrl(code) {
  return code.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromByteArray(bytes) {
  return mimeBase64ToUrl(base64js.fromByteArray(ensureUint8Array(bytes)));
}

function ensureUint8Array(arg) {
  if (arg instanceof ArrayBuffer) {
    return new Uint8Array(arg);
  } else {
    return arg;
  }
}