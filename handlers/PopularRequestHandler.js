const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);


const PopularRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PopularIntent';
    },
    handle(handlerInput) {



        return v3Client.movie.popular({"page":1})
            .then((data) => {
                let tab = data.results;
                let five = tab.slice(0, 4);
                let a = five.map(film => film.title);
                let movies = a.join(", ") + " and " + tab[5].title;

                let speakOutput = "Here are the popular movies of the moment: " + movies;
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();

            })
            .catch((error) => {
                console.log("error")
            });



    }
};
module.exports = PopularRequestHandler;