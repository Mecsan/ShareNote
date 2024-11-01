const createBatchResponse = require("./batchResponse");

module.exports = function batchMiddleware(req, res) {

    if (!Array.isArray(req.body)) {
        res.status(400);
        throw new Error("Invalid body for batch");
    }
    let end = false;

    for (let i = 0; i < req.body.length; i++) {
        const resource = req.body[i];
        // console.log(req.baseUrl, resource);
        const url = resource?.url;
        const route = "/api/" + url?.split("/api/")[1];

        // only supporting for GET requests
        if (route == req.baseUrl || resource.method !== 'GET') continue;

        const requestMock = {
            ...req,
            url: route,
            method: "GET",
            headers: { ...req.headers, ...resource.headers }
        };
        
        if(i === req.body.length - 1) end = true;
        const responseMock = createBatchResponse(resource, res, end);
        req.app._router.handle(requestMock, responseMock);
    }
}