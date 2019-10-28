const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const ExistDuoRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ExistDuoIntent';
    },
    handle(handlerInput) {

        let firstActor = handlerInput.requestEnvelope.request.intent.slots.firstActor.value;
        let secondActor = handlerInput.requestEnvelope.request.intent.slots.secondActor.value;
        return v3Client.search.people({query: firstActor})
            .then((data1) => {
                let id1 = data1.results[0].id;
                return v3Client.search.people({query: secondActor})
                    .then((data2) => {
                        let id2 = data2.results[0].id;
                        return v3Client.discover.movie({with_cast: id1 + "," + id2});
                    })
            })
            .then((movieData) => {

                let responds
                let movie = movieData.results
                if (movie.length == 0) {
                    responds = ["No, " + firstActor + " and " + secondActor + " never played together in a movie.",
                        "It could have been a good team but they never worked together."];
                } else {
                    let movieTitle = movie[0].title
                    responds = ["Yes, " + firstActor + " and " + secondActor + " played together in " + movieTitle + " for example.",
                        "They did ! You can watch " + movieTitle + " to appreciate the collaboration."];
                }

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

module.exports = ExistDuoRequestHandler;