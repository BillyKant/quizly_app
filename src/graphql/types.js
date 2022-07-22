// Import built in GraphQL data types
const { GraphQLObjectType, GraphQLInputObjectType, 
	GraphQLID, GraphQLString, GraphQLList, GraphQLInt, 
	GraphQLBoolean, GraphQLFloat } = require('graphql')

// Import our models so that we can interact with the DB
const { User, Quiz, Question, Submission } = require('../models')

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        quizzes: {
            type: new GraphQLList(QuizType),
            resolve(parent, args) {
                return Quiz.find({ userID: parent.id })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({ userID: parent.id })
            }
        }
    })
})

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    description: 'Question type',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        correctAnswer: { type: GraphQLString },
        quizID: { type: GraphQLString },
        order: { type: GraphQLInt },
        quiz: { 
            type: QuizType,
            resolve(parent, args) {
                return Quiz.findById(parent.quizID)
            }
        }
    })
})

const QuestionInputType = new GraphQLInputObjectType({
    name: 'QuestionInput',
    description: 'Question input type',
    fields: () => ({
        title: { type: GraphQLString },
        order: { type: GraphQLInt },
        correctAnswer: { type: GraphQLString }
    })
})

const AnswerInputType = new GraphQLInputObjectType({
    name: 'AnswerInput',
    description: 'Answer input type for quiz submits',
    fields: () => ({
        questionID: { type: GraphQLID },
        answer: { type: GraphQLString }
    })
})

const QuizType = new GraphQLObjectType({
    name: 'Quiz',
    description: 'Quiz type',
    fields: () => ({
        id: { type: GraphQLID },
        slug: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userID: { type: GraphQLString },
        user: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        },
        questions: { 
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Question.find({ quizID: parent.id })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({ quizID: parent.id })
            }
        },
        avgScore: {
            type: GraphQLFloat,
            async resolve(parent, args) {
                const submissionList = await Submission.find({ quizID: parent.id })
                let score = 0

                console.log(submissionList)
                for (const submission of submissionList) {
                    score += submission.score
                }

                return (score / submissionList.length) || 0
            }
        }
    })
})

const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    description: 'Submission type',
    fields: () => ({
        id: { type: GraphQLID },
        quizID: { type: GraphQLString },
        userID: { type: GraphQLString },
        score: { type: GraphQLInt },
        user: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        },
        quiz: { 
            type: QuizType,
            resolve(parent, args) {
                return Quiz.findById( parent.quizID)
            }
        }
    })
})

module.exports = {
    UserType,
    QuizType,
    QuestionType,
    QuestionInputType,
    AnswerInputType,
    SubmissionType
}