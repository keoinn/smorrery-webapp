import axios from 'axios'

const requestInstance = axios.create({
    baseURL: 'https://ssd-api.jpl.nasa.gov/',
    timeout: 30000,
    headers: {
        common: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            // 'strict-origin-when-cross-origin': '*'
        }
    }
})

export default requestInstance