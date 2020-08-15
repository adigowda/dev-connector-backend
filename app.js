const express = require('express')
const connectDB = require('./config/db')

const app = express()

app.use(express.urlencoded({ extended: true }))

const authRoute = require('./routes/api/auth')
const postsRoute = require('./routes/api/posts')
const profileRoute = require('./routes/api/profile')
const usersRoute = require('./routes/api/users')

connectDB()

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => res.send('Home'))

app.use('/api/auth', authRoute)
app.use('/api/posts', postsRoute)
app.use('/api/profile', profileRoute)
app.use('/api/users', usersRoute)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))