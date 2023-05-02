import {TIME_OUT} from './config.js'
// a settimeout function that retruns a rejected promise after the specified time limit.
const timeout = function (s) {
    return new Promise(function (_, reject) {
    setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

// refactor getJSON and sendJSON
export const ajaxcalls = async function(url, uploadData = undefined){
    try{
    const fetchdata = uploadData ? fetch(url, {
        // since we are making a POST request, we should provide an option how the data is going to be transfered and stored.
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        // and finally the PAYLOAD.
        body: JSON.stringify(uploadData),
    }) : fetch(url)
        // 1. Loading the recipes data
        const response = await Promise.race([fetchdata, timeout(TIME_OUT)]);
        // throwing maual errors if our request is not fullfilled.
        if (!response.ok) throw new Error(`${response.message} ${response.status}`);
        // if (!response.ok) throw new Error(`${response.message}`);
        const data = await response.json();
        return data
        }
        catch(error){
    
            throw new Error (error.message)
        }
}

// export const getJSON = async function(url){
//     try{
//         // 1. Loading the recipes data
//     const response = await Promise.race([fetch(url), timeout(TIME_OUT)])
//     // throwing maual errors if our request is not fullfilled.
//     if (!response.ok) throw new Error(`${response.message} ${response.status}`);
//     const data = await response.json();
//     return data
//     }
//     catch(error){
//         throw new Error (error.message)
//     }
// }
// // sendJSON fucntion to send data to api with post request
// export const sendJSON = async function(url, upload_data){
//     try{
//     // 1. Loading the recipes data
//     const response = await Promise.race([fetch(url, options), timeout(TIME_OUT)]);
//     // throwing maual errors if our request is not fullfilled.
//     if (!response.ok) throw new Error(`${response.message} ${response.status}`);
//     // if (!response.ok) throw new Error(`${response.message}`);
//     const data = await response.json();
//     return data
//     }
//     catch(error){

//         throw new Error (error.message)
//     }
//}