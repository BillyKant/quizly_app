const express = require('express')
const dotenv = require('dotenv')
const { connectDB } = require('./src/db')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./src/graphql/schema')
const { authenticate } = require('./src/middleware/auth')
const { userData } = require('./src/middleware/userData')
const cookieParser = require('cookie-parser')
const path = require('path')

dotenv.config()

const app = express()

// Connecting MongoDB
connectDB()

app.listen(process.env.PORT||443, () => {
    console.log(`Server now running on PORT: ${process.env.PORT}`)
})

// Middleware
app.use(cookieParser())
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)
app.use(userData)

// Setting View Engine  to ejs
app.set('view engine','ejs')
// update location of views folder that res.render pulls from
app.set('views', path.join(__dirname, '/src/templates/views'));

// Initializing Routes
require("./src/routes")(app)

app.get("/", (req, res) => {
		res.send('Hello World of Quizzes')
})


