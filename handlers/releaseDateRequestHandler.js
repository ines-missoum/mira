const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const ReleaseDateRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ReleaseDateIntent';
    },

    handle(handlerInput) {
        let movie = handlerInput.requestEnvelope.request.intent.slots.nameMovie.value;

        return v3Client.search.movies({query: movie})
            .then((data) => {
                let id = data.results[0].id;
                return v3Client.movie.releaseDates(id);
            })
            .then((date) => {

                let release_dates = date.results[0].release_dates;

                let responds;

                if (release_dates.length === 0) {
                    responds = [
                        "I'm sorry, I don't know the release date of " + movie,
                        "I'm afraid I don't have " + movie + " release date",
                        "Sorry, I don't know when " + movie + " was released"
                    ]
                } else {
                    let release_date = new Date(release_dates[0].release_date);
                    let monthyear_release_date = release_date.toLocaleString('default', { month: 'long' }) + " " + release_date.getFullYear();
                    responds = [
                        "The movie " + movie + " was released in " + monthyear_release_date,
                        "It was released in " + monthyear_release_date,
                        monthyear_release_date + " is the release date of " + movie,
                        "On " + monthyear_release_date,
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