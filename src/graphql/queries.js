const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')
const { UserType, QuizType, SubmissionType } = require('./types')
const { User, Quiz, Submission } = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users in database',
    resolve(parent, args){
        return User.find()
    }
}
const quizes = {
    type: new GraphQLList(UserType),
    description: 'Query all quizs in database',
    resolve(parent, args){
        return Quiz.find()
    }
}
const submissions = {
    type: new GraphQLList(SubmissionType),
    description: 'Query all users in database',
    resolve(parent, args){
        return Submission.find()
    }
}

const quizBySlug = {
    type: QuizType,
    description: 'Query quiz by slug value',
    args: {
        slug: {type: GraphQLString }
    },
    async resolve(parent, args){
        return Quiz.findOne({slug: args.slug})
    }
}

const submissionById = {
    type: SubmissionType,
    description: 'Query quiz submissions by ID',
    args:{
        id: {type: GraphQLString}
    },
    async resolve(parent, args){
        return Submission.findById(args.id)
    }
}
const user = {
    type: UserType,
    description: 'Query users  by ID',
    args:{
        id: {type: GraphQLString}
    },
    async resolve(parent, args){
        return User.findById(args.id)
    }
}

module.exports = { users, user, submissions, quizBySlug, submissionById, quizes}