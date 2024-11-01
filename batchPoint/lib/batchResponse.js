function createBatchResponse(req, res, isEnd = false) {

    const batchResponse = Object.create(res);
    batchResponse.statusCode = 200;
    batchResponse.headers = {};
    batchResponse.data = null;
    batchResponse.error = null;

    batchResponse.status = function (status) {
        this.statusCode = status;
        return this;
    }

    batchResponse.json = function (data) {
        if (data.err) {
            this.error = data;
        } else {
            this.data = data;
        }
        const chunk = this.getChunk();
        res.write(JSON.stringify(chunk));
        if(isEnd) res.end();
        return this;
    }

    batchResponse.setHeader = function (name, value) {
        this.headers[name] = value;
        return this;
    }

    batchResponse.getChunk = function () {
        return {
            url: req.url,
            method: req.method,
            data: this.data,
            error: this.error,
            status: this.statusCode,
            headers: this.headers,
        }
    }

    return batchResponse;
}

module.exports = createBatchResponse