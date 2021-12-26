const express = require('express')
const fs = require('fs/promises')
const path = require("path")
const app = express()
const dotenv = require('dotenv')
const JWTModule = require('./modules/Auth/JWT')
const database = require('./utils/database')
const port = 3001

const start = async () => {
    dotenv.config();
    app.use(express.json())

    fs.readdir(path.join(__dirname, 'apiRoutes'))
        .then(files => files
            .map(i => i.replace('.js', ''))
            .forEach(i => app.use(`/api/${i}`, JWTModule.checkAccessToken(), require(`./apiRoutes/${i}`)))
        )
    await database.sync()

    app.listen(port)
}

start().then(() => console.log(`server has- been started at: ${port}`))
