const axios = require('axios')

module.exports = async (req, res) => {
    const slug = req.params.slug
    
    let answers = []
    let submissionId = ''

    for (const answer in req.body) {
        if (answer !== 'title' && answer !== 'quizID') {
            answers.push({
                questionID: answer,
                answer: String(req.body[answer])
            })
        }
    }

    const mutation = `
        mutation submitQuiz($userID: String!, $quizID: String!, $answers: [AnswerInput!]!) { 
            submitQuiz( userID: $userID, quizID: $quizID, answers: $answers )
        }`

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
            { 
                query: mutation,
                variables: {
                    quizID: req.body.quizID,
                    userID: req.verifiedUser.user._id,
                    answers
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });   
        console.log(data)
        console.log({
            quizID: req.body.quizID,
            userID: req.verifiedUser.user._id,
            answers
        })
        submissionId = data.data.submitQuiz
    } catch(e) {
        console.log(e)
    }   

    res.redirect(`/quiz/results/${submissionId}`)
}