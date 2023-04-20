//let backendserver = 'localhost';
//let backendserver = '121.37.176.107';


export const root=`//121.37.176.107:8080`;
export const serverurl=`//vmeet.top:8081`;
export const tokenserver =`//vmeet.top:8082`;
// export const root=`http://localhost:8080`;
// export const serverurl=`http://localhost:8081`;
// export const tokenserver =`http://localhost:8082`;

export const postRequest = (url, json, callback) => {

    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    };

    fetch(url,opts)
        .then((response) => {
            if(response.status === 400 ) {
                //console.log(response);
                return [];
            }
            return response.json()
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

export const postRequest2 = (url, callback) => {

    let opts = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    };

    fetch(url,opts)
        .then((response) => {
            if(response.status === 400 ) {
                //console.log(response);
                return [];
            }
            return response.json()
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.log("error!!!",error);
        });
};
