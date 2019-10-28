const {v3} = require('@leonardocabeza/the-movie-db');

const v3Client = v3(process.env.API_KEY);

const BestMovieOfYearRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BestMovieOfYearIntent';
    },
    handle(handlerInput) {

        let yearRequested = handlerInput.requestEnvelope.request.intent.slots.movieYear.value;
        if (!isNaN(new Date(yearRequested, 0, 1))) {
            let y = parseInt(yearRequested)
            return v3Client.discover.movie({
                primary_release_year: y,
                "vote_count.gte": 5000,
                sort_by: "vote_average.desc"
            })
                .then((data) => {
                    let responds
                    if (data.results.length == 0) {
                        responds = [
                            "I'm sorry, I cannot give you a correct response for this year due to the number of votes",
                            "There is not enough votes on the movies of " + yearRequested + " to answer"]
                    } else {
                        let bestMovie = data.results[0]
                        let bestMovieTitle = bestMovie.title
                        let bestMovieAverage = bestMovie.vote_average + ""
                        let bestMovieNbVote = bestMovie.vote_count + ""
                        responds = [
                            "The best movie of " + yearRequested + " is " + bestMovieTitle +". It got " + bestMovieAverage + " based on " + bestMovieNbVote + " votes.",
                            bestMovieTitle + " was the best rated movie in " + yearRequested +" with " + bestMovieAverage + ". This was based on " + bestMovieNbVote + " votes."]
                    }

                    let speakOutput = responds[Math.floor(Math.random()*responds.length)]
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt(speakOutput)
                        .getResponse();

                })
        } else {
            let speakOutput = "I can only answer this question for a special year";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }


    }

}
module.exports = BestMovieOfYearRequestHandler;