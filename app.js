const express = require('express')
const path = require('path')
const app = express()
const PORT = 9000

app.use(express.static('public'))

app.listen(PORT, () => {
  console.log(`Server running at localhost${PORT}`)
})

// I have installed nodemon. to run, you simply type (nodemon) in the shell.
// If you want to know more about nodemon, try searching it yourself.
// Also, instead of running 'node app.js', I made it so that you can just type
// 'npm start' to get the server to run.
