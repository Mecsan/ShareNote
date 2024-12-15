module.exports = (err, req, res, next) => {
    let status = res.statusCode == 200 ? 500 : res.statusCode;
    console.log(err);

    // handling mongoose errors
    if(err.name == 'CastError'){
        err.message = 'invalid id : ' + err.value;
        status = 400;
    }else if(err.name == 'ValidationError'){
        let msg = Object.values(err.errors).map(val => val.message);
        err.message = msg.join(', ');
        status = 400;
    }
    
    res.status(status).json({ err: err.message || 'Something went wrong' })
}