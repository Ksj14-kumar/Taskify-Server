const cluster = require("cluster")
const os = require("os")
console.log(os.cpus())
const cpus = os.cpus().length
console.log(cpus)
if (cluster.isPrimary) {
    for (var i = 0; i < cpus; i++) {
        cluster.fork();
    }
    cluster.on("exit", () => {
        cluster.fork();
    })
}
else {
    const express = require("express")
    const app = express()
    const PORT = process.env.PORT || 5000
    const fs = require("fs")
    const utl = require("util")
    require("dotenv").config()
    const helmet = require("helmet")
    const URI = process.env.DB_URL || "mongodb://localhost:27017/taskify_test"
    const bodyParser = require("body-parser")
    const session = require("express-session")
    const cors = require("cors")
    const passport = require("passport")
    const router = require("./Routers/router")
    const mongoose = require("mongoose")
    const mongoStore = require("connect-mongo")
    const cookieParser = require("cookie-parser")
    const morgan = require("morgan")
    const path = require("path")
    const taskRouter = require("./Routers/TaskRouter")
    mongoose.connect(URI, (err) => {
        if (err) {
            console.log("not connected", err)
        }
        else {
            console.log("connected to db")
        }
    })
    app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }))
    app.use(bodyParser.json({ limit: "30mb" }))
    app.use(cors({
        origin: process.env.UI_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization', "Access-Control-Allow-Credentials"],
        credentials: true
    }))
    app.use(helmet())
    app.use(morgan("combined", { stream: fs.createWriteStream(path.join(__dirname, "logger.log"), { flags: "a" }) }))
    app.use(cookieParser())
    app.use(session({
        name: "session id",
        secret: process.env.SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: URI,
            collectionName: "sessions"
        }),
        cookie: {
            name: "session",
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
    require("./Authentication/Auth")(passport)
    app.use(passport.initialize())
    app.use(passport.session())
    app.use("/api/v1", router)
    app.use("/api/v1/task", taskRouter)
    
    console.log = function (d) {
        fs.createWriteStream(__dirname + "/log.log", { flags: "a" }).write(utl.format(d) + "\n")
        process.stdout.write(utl.format(d) + "\n")
    }
    // app.use(errorMiddleware)
    app.listen(PORT, (err) => {
        if (err) {
            console.log("err", err)
        }
        console.log(`server is start at http://127.0.0.1:${PORT}`)
    })
}
