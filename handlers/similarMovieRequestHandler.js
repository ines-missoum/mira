const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const SimilarMovieRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SimilarMovieIntent';
    },

    handle(handlerInput) {
        let movie = handlerInput.requestEnvelope.request.intent.slots.nameMovie.value;

        return v3Client.search.movies({query: movie})
            .then((data) => {
                let id = data.results[0].id;
                return v3Client.movie.similar(id);

            })
            .then((similar) => {

                let results = similar.results;

                let responds;
                if (results.length === 0) {
                    responds = [
                        "I'm sorry, I don't have a similar movie to " + nameMovie,
                        "Sorry, I haven't found a movie similar to " + nameMovie,
                        "Ow, I don't know a movie similar to " + nameMovie
                    ]
                } else {
                    let similar1 = results[0].original_title;

                    responds = [
                        similar1 + " is similar to the movie " + nameMovie,
                        similar1 + " is like the movie " + nameMovie,
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

module.exports = SimilarMovieRequestHandler;