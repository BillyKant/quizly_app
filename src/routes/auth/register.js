const axios = require('axios')

module.exports = async (req, res) => {
    const mutation = `
        mutation register($email: String!, $username: String!, $password: String!) { 
            register( email: $email, username: $username, password: $password ) 
        }`

    if (req.body.password !== req.body.confirmPassword) {
        res.send({ error: "Your passwords do not match" })
        return;
    }

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
            {  
                query: mutation,
                variables: {
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });   
        let value = await data
        const jwtToken = data.data.register
        console.log(value)
        console.log(jwtToken)
        res.cookie('jwtToken', jwtToken, { maxAge: 900000, httpOnly: true });

        res.redirect('/')
    } catch(e) {
        console.log(e.data.data.errors)
        res.redirect('/auth/register')
    }   
}