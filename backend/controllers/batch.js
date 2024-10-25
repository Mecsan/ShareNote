function batcher(app, req, res, next) {
    if (!Array.isArray(req.body)) {
        res.status(400);
        throw new Error("Invalid body for batch");
    }

    for (let i = 0; i < req.body.length; i++) {
        const resource = req.body[i];
        const url = resource.url;
        const route = "/api/" + resource.url.split("/api/")[1];
        if (route == '/api/batch') continue;

        const requestMock = {
            ...req,
            url: route,
            method: "GET",
            headers: { ...req.headers, ...resource.headers }
        };

        const reponseMock = {
            statusCode: null,
            error: null,
            data: null,
            headers: {},

            setHeader: function (name, value) {
                this.headers[name] = value;
                return this;
            },
            get status() {
                return this.statusCode;
            },
            status: function (status) {
                this.statusCode = status;
                return this;
            },
            json: function (data) {
                console.log(data)
                if (data.err) {
                    this.error = data;
                } else {
                    this.data = data;
                }
                const response = this.getMyReponse();
                res.write(JSON.stringify(response));
                if (i == req.body.length - 1) {
                    res.end();
                }
            },
            getMyReponse: function () {
                return {
                    url: url,
                    method: requestMock.method,
                    data: this.data,
                    error: this.error,
                    status: this.statusCode,
                    headers: this.headers,
                }
            }
        };

        app._router.handle(requestMock, reponseMock, (err) => { console.log("err", err) });
    }
};

module.exports = batcher