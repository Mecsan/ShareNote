const processRequest = (promiseFunc, retryCn = 2) => {
    const requestProcesser = async (...parms) => {
        try {
            let data = await promiseFunc(...parms);
            return data;
        } catch (e) {
            if (!retryCn) {
                location.href = '/unreachable'
            }
            console.log("Network Error , Retrying.. remaining retry : ", retryCn - 1);
            retryCn--;
            return await requestProcesser(...parms);
        }
    };
    return requestProcesser;
}

export { processRequest };