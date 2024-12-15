const router = require("express").Router();
const auth = require("../middleware/auth")
const { Login, Register, Info, userSetting, resetPassword } = require("../controllers/auth");

router.post("/signup", Register);

router.post("/login", Login);

router.get("/", auth, Info);

router.post("/reset-password", auth, resetPassword);

module.exports = router;