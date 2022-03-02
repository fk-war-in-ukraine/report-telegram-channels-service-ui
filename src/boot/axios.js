import axios from 'axios'

const api = axios.create({
  validateStatus: function (status) {
    return status === 200
  }
})

export default ({ Vue, router, store }) => {
  store.$axios = api
}

export { axios, api }
