import { ApplicationStates } from 'src/boot/values'

export async function isAuthorizedCheck (context) {
  const phoneNumber = context.state.phoneNumber
  const apiId = context.state.apiId
  const apiHash = context.state.apiHash

  const endpoint = `${process.env.API_ENDPOINT}/is_authorized/${phoneNumber}/${apiId}/${apiHash}`

  return await context.dispatch('application/makeAxiosRequest',
    {
      axiosPromise: this.$axios.get(endpoint),
      successActionFn: (response) => {
        context.commit('setIsAuthorized', response.data.isAuthorized)
      }
    },
    { root: true }
  )
}

export async function sendSigninCode (context) {
  const payload = {
    phoneNumber: context.state.phoneNumber,
    apiId: context.state.apiId,
    apiHash: context.state.apiHash
  }

  const endpoint = `${process.env.API_ENDPOINT}/send_signin_code`

  return await context.dispatch('application/makeAxiosRequest',
    {
      axiosPromise: this.$axios.post(endpoint, payload),
      successActionFn: (response) => {
        context.commit('setPhoneCodeHash', response.data.phoneCodeHash)
      }
    },
    { root: true }
  )
}

export async function signin (context) {
  const payload = {
    phoneNumber: context.state.phoneNumber,
    apiId: context.state.apiId,
    apiHash: context.state.apiHash,
    code: context.state.code,
    phoneCodeHash: context.state.phoneCodeHash
  }

  const endpoint = `${process.env.API_ENDPOINT}/signin`

  return await context.dispatch('application/makeAxiosRequest',
    {
      axiosPromise: this.$axios.post(endpoint, payload),
      successActionFn: (response) => {
        context.commit('setIsAuthorized', response.data.isAuthorized)
      }
    },
    { root: true }
  )
}

export async function reportChannels (context) {
  const payload = {
    phoneNumber: context.state.phoneNumber,
    apiId: context.state.apiId,
    apiHash: context.state.apiHash,
    channels: context.state.channels
  }

  const endpoint = `${process.env.API_ENDPOINT}/report`

  return await context.dispatch('application/makeAxiosRequest',
    {
      axiosPromise: this.$axios.post(endpoint, payload),
      successActionFn: (response) => {
        context.commit('setReportResults', response.data.reportResults)
      }
    },
    { root: true }
  )
}

export function logout (context) {
  context.commit('setIsAuthorized', false)
  localStorage.setItem('isAuthorized', false)

  context.commit('setPhoneNumber', '')
  localStorage.setItem('phoneNumber', '')

  context.commit('setApiId', '')
  localStorage.setItem('apiId', '')

  context.commit('setApiHash', '')
  localStorage.setItem('apiHash', '')

  context.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_LOGIN, { root: true })
}
