var router = require('express')
var request = require('request')

const route = router()
var features = [
    "list",
    "add"
]


route.post('/', async (req, res) => {
    let query = req.body.text.split('?')
    let mode = -1;

    

    if (query[0] == features[0])
        mode = 0;
    else if (query[0] == features[1])
        mode = 1;



    if (mode == 0) {
        request.get(`https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com/slack_clubs_lists/${(query[1].toUpperCase()).trim()}.json`, function (error, response, body) {
            if (response.body == "null") {
                let reply = {
                    "response_type": "in_channel",
                    "text": `Oh :crab: there seem to be no urls here. Add some now with *add?${(query[1].toUpperCase()).trim()}?<valid_url>?description*`,
                }
                res.send(reply)
            }
            else {
                let reply = {
                    "response_type": "in_channel",
                    "blocks": makeMessage(JSON.parse(response.body)),
                }

                res.send(reply)
            }
        })
    }
    else if (mode == 1) {
        request.get(`https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com/slack_clubs/${(query[1].toUpperCase()).trim()}.json`, function (error, response, body) {

            if (response.body == "true") {

                if (query[2] == null || query[2] == undefined || query[2] == '' || !validateUrl(query[2])) {
                    let reply = {
                        "response_type": "in_channel",
                        "text": `Oh :crab: wrong format or not a valid url. Please make sure you format acoording to *add?${(query[1].toUpperCase()).trim()}?<valid_url>?description*`,
                    }

                    res.send(reply)
                } else if (query[3] == null || query[3] == undefined || query[3] == '' || query[3].length < 5) {
                    let reply = {
                        "response_type": "in_channel",
                        "text": `Oh :crab: description seems to be too short mahn *add?${(query[1].toUpperCase()).trim()}?<valid_url>?description*`,
                    }

                    res.send(reply)
                }
                else {
                    let reply = {
                        "response_type": "in_channel",
                        "text": ":fire: 1..2..3... aahh memorized",
                    }

                    res.send(reply)
                    request.post({ url: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com/slack_clubs_lists/${(query[1].toUpperCase()).trim()}.json`, json: { addedBy: req.body.user_name, uuid: req.body.user_id, link: query[2].trim(), description: query[3].trim() } })
                }
            } else {
                let reply = {
                    "response_type": "in_channel",
                    "text": `Oh :crab: it looks like ${query[1].toUpperCase()} has not set up their workspace yet`,
                }
                res.send(reply)
            }

        })
    }
    else {
        let reply = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Jesus can't walk on water and I cant perform this task :fire:",
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "The supported operations are *list?<club_name>*, *add?<club_name>?<valid_url>?description*"
                        }
                    ]
                }
            ]
        }

        res.send(reply)

    }
})

function makeMessage(value) {

    message = []

    message.push({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Here are a list of all contribution you guys made to the organization* :fire:"
        }
    })

    for (key in value) {
        message.push({
            "type": "context",
            "elements": [{
                "type": "mrkdwn",
                "text": ` :point_right: *${value[key]['description']}  :fire: by ${value[key]['addedBy']}*`
            }]
        });

        message.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `<${value[key]['link']}|Click here to view the resource>`
                }
            ]
        })


        message.push({ "type": "divider" })
    }

    console.log(message)
    return message
}

function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

module.exports = route;
