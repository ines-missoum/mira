require('dotenv').config();
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = require('./handlers/launchRequestHandler');
const CancelAndStopIntentHandler = require('./handlers/cancelAndStopIntentHandler');
const FallbackHandler = require('./handlers/fallbackHandler');
const HelpRequestHandler = require('./handlers/helpRequestHandler');
const SessionEndedRequestHandler = require('./handlers/sessionEndedRequestHandler');
const PopularRequestHandler = require('./handlers/PopularRequestHandler');
const DirectorRequestHandler = require('./handlers/directorRequestHandler');



exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CancelAndStopIntentHandler,
        FallbackHandler,
        HelpRequestHandler,
        PopularRequestHandler,
        DirectorRequestHandler,
        SessionEndedRequestHandler
    )
    .lambda();