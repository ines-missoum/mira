const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const MoviesOfGenreRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MovieOfGenreIntent';
    },
    handle(handlerInput) {

        let genreRequested = handlerInput.requestEnvelope.request.intent.slots.genreMovie.value.toLowerCase();

        // GET ALL GENRES
        return v3Client.genre.movieList()
            .then((data) => {
                return data.genres
            })

            .then((listGenres) => {

                let responds;
                let getGenderRequested = listGenres.filter(genre => genre.name.toLowerCase() === genreRequested);

                // CHECK IF REQUESTED GENRE EXISTS
                if (getGenderRequested.length !== 0) {
                    return v3Client.discover.movie({
                        with_genres: getGenderRequested[0].id,
                        sort_by: "vote_average.desc"
                    })
                        .then((movies) => {

                            let movie1 = movies.results[0].original_title;
                            let movie2 = movies.results[1].original_title;
                            let movie3 = movies.results[2].original_title;

                            responds = [
                                "Here is some " + genreRequested + " movies : " + movie1 + ", " + movie2 + ", and " + movie3,
                                "I know " + movies.results.length + " " + genreRequested + " movies including " + movie1 + ", " + movie2 + ", and " + movie3,
                                "There are lots of " + genreRequested + " movies such as " + movie1 + ", " + movie2 + ", and " + movie3
                            ];

                            let speakOutput = responds[Math.floor(Math.random() * responds.length)];
                            return handlerInput.responseBuilder
                                .speak(speakOutput)
                                .reprompt(speakOutput)
                                .getResponse();
                        })
                } else {
                    responds = [
                        "Hmmm, sorry I can only answer this question for a specific movie genre such as " + listGenres[Math.floor(Math.random() * listGenres.length)].name + " or " + listGenres[Math.floor(Math.random() * listGenres.length)].name,
                        "Sorry, I don't know the genre " + genreRequested
                    ];

                    let speakOutput = responds[Math.floor(Math.random() * responds.length)];
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt(speakOutput)
                        .getResponse();
                }
            })
    }
};
module.exports = MoviesOfGenreRequestHandler;