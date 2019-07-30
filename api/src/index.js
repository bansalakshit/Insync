import express from "express"
import compression from "compression"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import logger from "morgan"
import chalk from "chalk"
import errorHandler from "errorhandler"
import expressValidator from "express-validator"
import passport from "passport"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from 'dotenv'
import api from './routes/v1' // use version 1 of api

dotenv.config()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})  
mongoose.connection.on('error', (err) => {
    console.error(err)
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
    process.exit()
})

const app = express()

require("./config/passport")

app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expressValidator())

app.use(passport.initialize())
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)


let corsOptions = {
    origin: 'https://insync.team',
    credentials: true
}
if (process.env.NODE_ENV !== 'production') {
    // only use in development
    app.use(errorHandler())
    let whitelist = ['http://localhost:3000', 'http://localhost:8000']
    corsOptions = {
        origin: (origin, callback) => {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }
} else {
    app.use((err, req, res, next) => {
        console.error(err)
        res.status(500).send('Server Error')
    })
}

app.use(cors(corsOptions))

app.use(api())

app.listen(process.env.PORT || 8080, () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), process.env.PORT || '8080', process.env.NODE_ENV || 'development')
    console.log('  Press CTRL-C to stop\n')
})

export default app