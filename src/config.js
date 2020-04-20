const config = {
  API_URL: 'https://localhost:5001',
}

if (process.env === 'PRODUCTION') {
  config.API_URL = 'https://upside-api.herokuapp.com'
}

export default config

//to import:
//import config from '../config'

//to use:
//axios.get(config.API_URL + '/api/blog')
