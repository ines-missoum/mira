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
                        "Sorry, I don't have a similar movie to " + movie,
                        "Hmmm, I haven't found a movie similar to " + movie,
                        "Oww sorry, I don't know a movie similar to " + movie
                    ]

                } else if (results.length > 10) {

                    let randoms = getRandoms();
                    let similar1 = results[randoms[0]].original_title;
                    let similar2 = results[randoms[1]].original_title;
                    let similar3 = results[randoms[2]].original_title;

                    responds = [
                        "Here are some movies similar to " + movie + ": " + similar1 + ", " + similar2 + ", and " + similar3 + ".",
                        "Hmmm, the movies " + similar1 + ", " + similar2 + ", and " + similar3 + " are similar to " + movie,
                    ]

                } else {
                    let similar1 = results[0].original_title;
                    responds = [similar1 + " is similar to the movie " + movie]
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

/**
 * @return [] array of 3 distinct random numbers between 0 and 9
 */
function getRandoms() {
    let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let n;
    let r = [];
    for (n = 1; n <= 3; ++n) {
        let i = Math.floor((Math.random() * (9 - n)) + 1);
        r.push(a[i]);
        a[i] = a[9 - n];
    }
    return r
}

module.exports = SimilarMovieRequestHandler;