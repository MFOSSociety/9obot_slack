var router = require('express')
const dialogflow = require('dialogflow')
const uuid = require('uuid')
const environment = require('../../environment')

let route = router()

route.post('/', async function (req, res) {

        
        const sessionId = uuid.v4();

        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(environment.dialog_flow_agent, sessionId);
        
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.text,
                    languageCode: 'en-US',
                }
            }
        }
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        let message = {
            "response_type": "in_channel",
            "text": result.fulfillmentText,
        }

        res.send(message)

    


})



module.exports = route;