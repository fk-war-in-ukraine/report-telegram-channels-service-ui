export function closeErrorMessage (context) {
  context.commit('setShowErrorMessage', false)
}

export async function makeAxiosRequest (context, payload) {
  const axiosPromise = payload.axiosPromise
  const successActionFn = payload.successActionFn

  let result = false

  try {
    const response = await axiosPromise
    if (response.status === 200) {
      console.log(response)
      successActionFn(response)

      result = true
    } else {
      context.commit('setShowErrorMessage', true)
    }
  } catch {
    context.commit('setShowErrorMessage', true)
  }

  return result
}
