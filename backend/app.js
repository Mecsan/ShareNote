const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
const cors = require('cors');
require('dotenv').config();
require("./config/connectDb");

const userRoute = require("./routes/user");
const noteRoute = require("./routes/note");
const sectionRoute = require("./routes/section");
const errHandler = require('./middleware/err');
const batchMiddleware  = require("../batchPoint");

app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/note", noteRoute);
app.use("/api/section", sectionRoute);
app.post("/api/batch", batchMiddleware);

app.use(errHandler);

app.get("/unreachable", async (req, res) => {
    res.send('<h1>Requested Service unavailable</h1>')
});

if (process.env.NODE_ENV == "production") {
    const mypath = path.resolve(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(mypath));

    app.use("*", (req, res) => {
        res.sendFile(path.resolve(mypath, "index.html"));
    })
}

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("server running on " + (process.env.PORT ? process.env.PORT : 3000))
});

server.timeout = 1000
