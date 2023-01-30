const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
require('dotenv').config();
require("./config/connectDb");

const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");
const dirRoute = require("./routes/dir");
const notiRoute = require("./routes/noti");

const { UpdateDb } = require("./controllers/noti");

// every 1 minute update database for notification
setInterval(UpdateDb, 60 * 1000);

const authenticate = require("./middleware/authmiddleware");

app.use(cors());

app.use("/user", userRoute);
app.use("/noti", authenticate, notiRoute);
app.use("/task", authenticate, taskRoute);
app.use("/dir", authenticate, dirRoute);

if(process.env.NODE_ENV=="production"){
    app.use(express.static("../frontend/dist"));

    app.use("*",(req,res)=>{
        res.sendFile("../frontend/dist/index.html");
    })
}

app.listen(process.env.PORT || 3000, () => console.log("server running on " + (process.env.PORT ? process.env.PORT : 3000)))






