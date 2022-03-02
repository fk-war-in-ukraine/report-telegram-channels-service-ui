export function setPhoneNumber (state, phoneNumber) {
  console.log(phoneNumber)
  state.phoneNumber = phoneNumber
  localStorage.setItem('phoneNumber', phoneNumber)
}

export function setApiId (state, apiId) {
  console.log(apiId)
  state.apiId = apiId
  localStorage.setItem('apiId', apiId)
}

export function setApiHash (state, apiHash) {
  console.log(apiHash)
  state.apiHash = apiHash
  localStorage.setItem('apiHash', apiHash)
}

export function setIsAuthorized (state, isAuthorized) {
  state.isAuthorized = isAuthorized
  localStorage.setItem('isAuthorized', isAuthorized)
}

export function setPhoneCodeHash (state, phoneCodeHash) {
  state.phoneCodeHash = phoneCodeHash
}

export function setCode (state, code) {
  state.code = code
}

export function setChannels (state, channelsStr) {
  state.channels = channelsStr.split('\n')
}

export function setReportResults (state, reportResults) {
  state.reportResults = reportResults
}
