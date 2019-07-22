'use strict'
const router = require('express');
var request = require('request');
var _jokesURL = "https://geek-jokes.sameerkumar.website/api"

let route = router()

route.post('/', async (req, res) => {

    request.get(_jokesURL, function (error, response, body) {
        let reply = {
            "response_type": "in_channel",
            "text": `Hi *${req.body.user_name}* we love to welcome everyone with a joke, here is a personalized joke for you`,
            "attachments": [{
                "text": response.body
            }]
        }
        res.send(reply)
    })


})

module.exports = route;