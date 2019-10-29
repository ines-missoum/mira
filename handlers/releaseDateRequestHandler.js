const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const ReleaseDateRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DateReleaseIntent';
    },

    handle(handlerInput) {
        let movie = handlerInput.requestEnvelope.request.intent.slots.nameMovie.value;

        return v3Client.search.movies({query: movie})
            .then((data) => {
                let id = data.results[0].id;
                return v3Client.movie.releaseDates(id);

            })
            .then((date) => {

                let release_dates = date.results.release_dates;

                let responds;
                if (release_dates.length === 0) {
                    responds = [
                        "I'm sorry, I don't know the release date of " + nameMovie,
                        "I'm afraid I don't have " + nameMovie + " release date",
                        "Sorry, I don't know when " + nameMovie + " was released"
                    ]
                } else {
                    let release_date = release_dates[0].release_dates;
                    responds = [
                        nameMovie + "was released on " + release_date,
                        "It was released on " + release_date,
                        release_date + " is the release date of " + nameMovie,
                        "on " + release_date,
                    ]
                }

                let speakOutput = responds[Math.floor(Math.random() * responds.length)];

                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            })

            .catch(() => {
                let speakOutput = "Sorry, I don't know this movie.";
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            })
    }
};

module.exports = ReleaseDateRequestHandler;