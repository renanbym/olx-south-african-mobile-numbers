import express from 'express';
import load from 'load';
import bodyParser from 'bodyParser';

const credentials = require('./config/config')[process.env.NODE_ENV]

const app = express()
const server = http.createServer(app)

app.disable('x-powered-by');
app.set('trust proxy', 1)

app.set('views', './web')

app.use('/public', express.static('./web/public'))
app.use('/node_modules', express.static('./node_modules'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


load('models', { cwd: 'app' })
    .then('controllers')
    .then('routes')
    .into(app)

app.get('/', (req, res) => {
    res.render('index.html')
})

server.listen(process.env.PORT || credentials.port)
    .on('listening', () => {
        console.log('Run, forest run', process.env.NODE_ENV, credentials.port)
    })

export default app