const { Pool } require ('pg')
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: '',
  password: ''
})

client.connect()
    .then(()=>{console.log('connected')})
    .catch(()=>{console.error('connection error', err.stack})

