const express = require('express');
const filesRouter = require('./api/v1/files-router');
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os');
const PORT = process.env.PORT || 5000;

const app = express();


app
.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.json({limit: '50mb'}))
.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use('/debug', (req, res) => {
  res.json({status: 'ok', machine: os.hostname()});
})
.use('/', filesRouter)
// .get('/', (req, res) => res.render('pages/index'))
.listen(PORT, () => console.log(`Listening on ${ PORT }`));
