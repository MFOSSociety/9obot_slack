var router = require('express');
var request = require('request');
var environment = process.env;

var fetchMessageUrl = `https://slack.com/api/conversations.history?token=${environment.slack_api_user}`
var deleteMessageURL = `https://slack.com/api/chat.delete`

let route = router();


route.post('/', async (req, res) => {
    let limit = parseInt(req.body.text);

    if (limit == undefined || limit == null)
        limit = 5;

    request.get(fetchMessageUrl + `&channel=${req.body.channel_id}` + `&limit=${limit}`, function (error, response, body) {
        let reply = JSON.parse(response.body)

        if (!reply.ok)
            res.send("Knomm Knomm Knommm... the server is out for lunch :chicken:")
        else {

            for (let i = 0; i < reply.messages.length; i++) {
                request.post({
                    url: deleteMessageURL,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    form: {
                        token: environment.slack_api_user,
                        channel: req.body.channel_id,
                        ts: reply.messages[i].ts,
                    }
                }, function (e, r, body) {
                    console.log(body);
                })

            }
            let message = {
                "response_type": "in_channel",
                "text": "Rawrrr... Message deletion completed. :fireworks:",
            }

            res.send(message);
        }
    })

})


module.exports = route;