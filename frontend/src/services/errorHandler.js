
const handleError = (promise) => {
    return async (...parms) => {
        try {
            let data = await promise(...parms);
            return data;
        } catch (e) {
            console.log("Network error : ", e);
            return { err: e.message || "something went wrong" }
        }
    }
}

export { handleError };