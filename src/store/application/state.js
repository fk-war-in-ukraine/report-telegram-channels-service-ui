import { ApplicationStates } from 'src/boot/values'

export default function () {
  return {
    applicationState: ApplicationStates.STATE_WAITING_FOR_LOGIN,
    showErrorMessage: false
  }
}
