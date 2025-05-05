export async function fetchData(path) {
    let response = await fetch(path, {
        method: "GET",
        headers: {
            'content-type': 'application/json'
        }
    });
    let data = await response.json();
    return data;
}

export function takeImg(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            resolve(reader.result);
        }
        reader.onerror = function () {
            reject(reader.error);
        }
    });
}

export const sleep = (timeInSeconds) => new Promise((resolve) => setTimeout(resolve, 1000 * timeInSeconds));