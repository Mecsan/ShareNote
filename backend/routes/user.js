const router = require("express").Router();
const auth = require("../middleware/auth")
const { Login, Register, Info, userSetting } = require("../controllers/auth");

router.post("/signup", Register);

router.post("/login", Login);

router.get("/", auth, Info);

module.exports = router;