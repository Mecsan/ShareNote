const router = require("express").Router();
const {
    getTask,
    addTask,
    updateTask,
    deleteTask,

} = require('../controllers/task')

const Dirmiddleware = require("../middleware/Dirmiddleware");

const taskmiddle = require("../middleware/taskmiddleware")

router.get("/:dirId", Dirmiddleware, getTask);

router.post("/:dirId", Dirmiddleware, addTask);

router.delete("/:dirId/:taskId", Dirmiddleware, taskmiddle, deleteTask);

router.put("/:dirId/:taskId", Dirmiddleware, taskmiddle, updateTask);

module.exports = router;
