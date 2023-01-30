const router = require('express').Router();
const { getNotis, seenNotis, deleteNoti } = require('../controllers/noti');

router.get("/", getNotis);
// to get all notifications

router.get("/:notiId", seenNotis);
// to mark a noti as seen

router.delete("/:id", deleteNoti);
// to delete a notification

module.exports = router;