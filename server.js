var express = require('express');
var secrets = require('./environment');
var bodyParser = require('body-parser');

let apiVersion = {
    v1: '/api/v1'
}
let app = express()

let welcomeRoute = require('./api/routes/welcome')
let newsRoute = require('./api/routes/news')
let clearRoute = require('./api/routes/clear')
let queryRoute = require('./api/routes/query')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
    res.send('server working')
})


app.use(`${apiVersion.v1}/news`, newsRoute);
app.use(`${apiVersion.v1}/welcome`, welcomeRoute);
app.use(`${apiVersion.v1}/clear`, clearRoute);
app.use(`${apiVersion.v1}/query`, queryRoute)


app.listen(secrets.port, (err) => {
    if (err)
        throw err;
    else
        console.log(`App is listning to ${secrets.port}`)
});