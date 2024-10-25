import { batchAPi } from "../config/apis";

const fetch = window.fetch;

const BATCH_WINDOW = 50000; // 10 ms

// const BATCH_SIZE = 5; // 5 requests

let batch = [];

function parseMy(str, unique) {
    let parsed = [];
    let st = 0;
    do {
        let idx = str.indexOf(unique, st + unique.length);
        if (idx == -1) {
            parsed.push(JSON.parse(str.slice(st)));
        } else {
            parsed.push(JSON.parse(str.slice(st, idx)));
        }
        st = idx;
    } while (st != -1);
    return parsed;
}

function parseUsingUrl(str) {
    return parseMy(str, '{"url":');
}

const promiseWithJson = data => new Promise((res, rej) => {
    res({
        json: () => {
            return data;
        }
    })
})

async function executeBatch() {

    let body = [];
    let response = {};

    let currentBatch = [...batch];
    batch = [];

    for (let batchItem of currentBatch) {
        response[`${batchItem.method} ${batchItem.url}`] = {
            resolve: batchItem.resolve,
            reject: batchItem.reject
        }

        body.push({
            url: batchItem.url,
            headers: batchItem.headers,
            method: batchItem.method,
        });
    };

    let res = await fetch(batchAPi, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });

    for await (const chunk of res.body) {
        const json = new TextDecoder().decode(chunk);
        const parsedData = parseUsingUrl(json);
        for (let data of parsedData) {
            let responseObject = response[`${data.method} ${data.url}`];
            if (data.error) {
                responseObject.resolve(promiseWithJson(data.error));
            } else {
                responseObject.resolve(promiseWithJson(data.data));
            }
            delete response[`${data.method} ${data.url}`]
        }
    }

    for (let responseObject in response) {
        responseObject.reject(new Error("Something went wrong"));
    }

}

window.fetch = (function () {

    const defaultOptions = {
        method: "GET",
        headers: {
            "content-type": "application/json"
        },
        batchEnable: false
    }

    return async function (url, optionsParam, cb) {
        let options = {
            ...defaultOptions,
            ...optionsParam
        }
        console.log("yes ")

        if (!options.batchEnable || (options.method && options.method !== "GET")) {
            delete options.batchEnable;
            return fetch(url, options);
        };

        return new Promise((resolve, reject) => {

            batch.push({
                url: url,
                method: options.method,
                headers: options.headers,
                resolve: resolve,
                reject: reject
            });

            if (batch.length == 1) {
                setTimeout(executeBatch, 10000);
            }
        });
    }
})();