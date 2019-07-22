let router = require('express');
let route = router();
var environment = process.env;
var request = require('request')
var error = require('../models/newsSources')

route.post('/', async (req, res) => {

    var there = error.find(function (elements) {
        return elements['id'] == req.body.text
    })

    if (!there) {
        let reply = {
            "response_type": "in_channel",
            "text": "The selected news source is not valid please select one from the list",
            "blocks": parseError()
        }

        res.send(reply)
        console.log('error')
    }

    else
        request.get(generateNewsURL(req.body.text), function (error, response, body) {


            let newsBody = JSON.parse(response.body)
            if (newsBody.status === "error") {
                let reply = {
                    "response_type": "in_channel",
                    "text": "The selected news source is not valid please select one from the list",
                    "blocks": parseError()
                }

                res.send(reply)
            }

            else {
                let reply = {
                    "response_type": "in_channel",
                    "text": "Here are the top news",
                    "blocks": parseNews(newsBody.articles)
                }
                res.send(reply)
            }

        })
})

function parseError() {
    let slackError = []


    slackError.push({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*To err is to human. The source you entered was invalid. Please select on from the list* :fire:"
        }
    })


    for (let i = 0; i < error.length; i++) {
        slackError.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `:point_right: *${error[i]['id']}:* ${error[i]['description']}`
                }
            ]
        })
    }

    return slackError
}


function parseNews(news) {

    let slackNews = [];

    slackNews.push({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Here are the latest article from the source* :fire:"
        }
    })



    for (let i = 0; i < news.length; i++) {
        slackNews.push({
            "type": "context",
            "elements": [{
                "type": "mrkdwn",
                "text": ` :point_right: *${news[i]['title']}*`
            }]
        });

        slackNews.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `<${news[i]['url']}|Click here to read full coverage>`
                }
            ]
        })


        slackNews.push({ "type": "divider" })
    }

    return slackNews;

}


function generateNewsURL(text) {
    return `https://newsapi.org/v2/top-headlines?sources=${text}&apiKey=${environment.new_api}`
}

module.exports = route;


