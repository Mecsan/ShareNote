import { batchAPi, sectionApi, userApi } from "../config/apis";

const nativeFetch = window.fetch;

const BATCH_WINDOW = 100; // 100 ms

const BATCH_SIZE = 5; // max 5 requests in a single batch

let batch = [];
let timerID = null;

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

    if (currentBatch.length == 1) {
        nativeFetch(currentBatch[0].url, currentBatch[0])
            .then((data) => currentBatch[0].resolve(data))
            .catch((e) => currentBatch[0].reject(e));

        return;
    }

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

    try {
        let res = await nativeFetch(batchAPi, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let completed = {};

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
                completed[`${data.method} ${data.url}`] = true;
            }
        }

        for (let key in response) {
            if (!completed[key]) {
                response[key].reject(new Error("Something went wrong"));
            }
        }
    } catch (e) {
        console.log("Error while making batch request ", e);
        for (let key in response) {
            response[key].reject(new Error("Something went wrong"));
        }
    }
}

const defaultOptions = {
    method: "GET",
    headers: {
        "content-type": "application/json"
    },
    batchEnable: false
}

window.fetch = async function (url, optionsParam) {
    let options = {
        ...defaultOptions,
        ...optionsParam
    }

    if (!options.batchEnable || (options.method !== "GET")) {
        delete options.batchEnable;
        return nativeFetch(url, options);
    };

    return new Promise((resolve, reject) => {

        batch.push({
            url: url,
            method: options.method,
            headers: options.headers,
            resolve: resolve,
            reject: reject
        });

        if (batch.length === BATCH_SIZE) {
            clearTimeout(timerID);
            executeBatch();
        }

        if (batch.length == 1) {
            timerID = setTimeout(() => {
                executeBatch()
            }, BATCH_WINDOW);
        }
    });
};


// test();

async function test() {
    async function user() {
        const res = await fetch(userApi, {
            headers: {
                'authorization': localStorage.getItem('noteAuth'),
                'content-type': "application/json"
            },
            batchEnable: true
        })
        const data = await res.json();
        console.log(data)
    }

    async function section() {
        const res = await fetch(sectionApi, {
            headers: {
                'authorization': localStorage.getItem('noteAuth'),
                'content-type': "application/json"
            },
            batchEnable: true
        });
        const data = await res.json();
        console.log(data)
    }
    user();
    section();
}



