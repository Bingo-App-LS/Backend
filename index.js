const server = require('./api/server.js')

const port = process.env.PORT || 4500

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})