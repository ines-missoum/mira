const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const DirectorRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DirectorIntent';
    },
    handle(handlerInput) {


        let movie = handlerInput.requestEnvelope.request.intent.slots.nameMovie.value;

        return v3Client.search.movies({query: movie})
            .then((data) => {
                let id = data.results[0].id;

                return v3Client.movie.credits(id);
            })
            .then((credits) => {

                let crew = credits.crew;
                let directorName = crew.filter(person => person.job === 'Director')[0].name;

                let speakOutput = "The director of this movie is: " + directorName;
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            })


    }
};

module.exports = DirectorRequestHandler;