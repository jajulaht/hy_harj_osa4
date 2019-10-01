const app = require('./app') // import app
const http = require('http')
const config = require('./utils/config')

// Starting the app
const server = http.createServer(app)

// Setting listener
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})