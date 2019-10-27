/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = require('./handlers/launchRequestHandler');
const CancelAndStopIntentHandler = require('./handlers/cancelAndStopIntentHandler');
const FallbackHandler = require('./handlers/fallbackHandler');
const HelpRequestHandler = require('./handlers/helpRequestHandler');
const SessionEndedRequestHandler = require('./handlers/sessionEndedRequestHandler');



exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CancelAndStopIntentHandler,
        FallbackHandler,
        HelpRequestHandler,
        SessionEndedRequestHandler
    )
    .lambda();