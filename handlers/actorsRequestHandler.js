const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const ActorsRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActorsIntent';
    },
    handle(handlerInput) {
        let movie = handlerInput.requestEnvelope.request.intent.slots.nameMovie.value;

        return v3Client.search.movies({query: movie})
            .then((data) => {
                let id = data.results[0].id;
                return v3Client.movie.credits(id);

            })
            .then((credits) => {

                let casting = credits.cast;
                let actors = casting.map(actor => actor.name);

                let responds = ["Here are a few actors that have played in this movie : " + actors[0] + ", " + actors[1] + ", " + actors[2],
                    actors[0] + ", " + actors[1] + " and " + actors[2] + " played in this movie"];
                let speakOutput = responds[Math.floor(Math.random() * responds.length)];
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            })
            .catch(() => {
                let speakOutput = "I don't know this movie.";
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            })


    }
};

module.exports = ActorsRequestHandler;