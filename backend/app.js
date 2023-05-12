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

const authenticate = require("./middleware/auth");

app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/note", authenticate, noteRoute);
app.use("/api/section", authenticate, sectionRoute);

if (process.env.NODE_ENV == "production") {
    const mypath = path.resolve(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(mypath));

    app.use("*", (req, res) => {
        res.sendFile(path.resolve(mypath,"index.html"));
    })
}

app.listen(process.env.PORT || 3000, () => console.log("server running on " + (process.env.PORT ? process.env.PORT : 3000)))






