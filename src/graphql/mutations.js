const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt } = require('graphql')
const { QuestionInputType, AnswerInputType } = require('./types')
const { User, Quiz, Question, Submission } = require('../models')
const { createJwtToken } = require('../util/auth')

const register = {
    type: GraphQLString,
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        
        const checkUser = await User.findOne({ email: args.email })
        if (checkUser) {
            throw new Error(`User with this email ${args.email} address already exists`)
        }

        const { username, email, password } = args
        const user = new User({ username, email, password })

        await user.save()

        const token = createJwtToken(user)
        return token
    }
}

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const user = await User.findOne({ email: args.email })
        if (!user) {
            throw new Error("No user with that email")
        } else if (args.password !== user.password) {
            throw new Error("Invalid password")
        }

        const token = createJwtToken(user)
        return token
    }
}

const createQuiz = {
    type: GraphQLString,
    args: {
        questions: { 
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionInputType)))
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        userID: {
            type: GraphQLString
        }
    },
    async resolve(parent, args) {
        /* Generate slug version of quiz for url */
        let slugify = args.title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        let fullSlug = ''

        /* Add a random integer to the end of the slug, check that slug doesn't already exist.
        *  If it does exist, generate new slug. Else continue.
        */
        while (true) {
            let slugId = Math.floor(Math.random()*10000)
            fullSlug = `${slugify}-${slugId}`

            const existingQuiz = await Quiz.findOne({ slug: fullSlug })
            
            if (!existingQuiz)
                break;
        }

        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userID: args.userID
        })

        await quiz.save()

        /* Create question types and connect to new quiz */
        for (const question of args.questions) {
            const questionItem = new Question({
                title: question.title,
                correctAnswer: question.correctAnswer,
                order: Number(question.order),
                quizID: quiz.id
            })
            questionItem.save()
        }

        return quiz.slug
    }
}

const submitQuiz = {
    type: GraphQLString,
    args: {
        answers: { 
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))
        },
        userID: {
            type: GraphQLString
        },
        quizID: {
            type: GraphQLString
        }
    },
    async resolve(parent, args) {
        try{
        let correct = 0
        let totalScore = args.answers.length

        for (const answer of args.answers) {
            const questionAnswer = await Question.findById(answer.questionID)

            if (answer.answer.trim().toLowerCase() === questionAnswer.correctAnswer.trim().toLowerCase()) {
                correct++
            }
        }

        const score = (correct / totalScore) * 100

        const submission = new Submission({
            userID: args.userID,
            quizID: args.quizID,
            score
        })

        submission.save()

            return submission.id
        }
        catch(e) {
            console.log(e)
            return ''
        }
    }
}

module.exports = { register, login, createQuiz, submitQuiz }