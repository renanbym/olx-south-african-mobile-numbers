process.on('unhandledRejection', up => { throw up })

const express = require('express');
const load = require('express-load');
const bodyParser = require('body-parser');
const http = require('http');

const app = express()
const server = http.createServer(app)

app.set('view engine', 'ejs')
app.set('views', './web')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); });

load('controllers', { cwd: 'app' })
    .then('routes')
    .into(app)

app.get('/', (req, res) => {
    res.render('index.ejs')
})

server.listen(process.env.PORT || 3001)
    .on('listening', () => {
        console.log('run, forest!', process.env.NODE_ENV, process.env.PORT || 3001)
    })

module.exports = app