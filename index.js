// code away!
require('dotenv').config()

const server = require('./server.js');
const port = process.env.PORT || 6666

server.listen(port, () =>  console.log(`server on port ${port}`));