module.exports = (err, req, res, next) => {
    let status = res.statusCode == 200 ? 500 : res.statusCode;
    console.log(err);
    res.status(status).json({ err: err })
}