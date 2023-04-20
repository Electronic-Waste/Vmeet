import CryptoJS from "crypto-js";

const aseKey = "vmeet111";

export function encrypt(data) {
    return CryptoJS.AES.encrypt(data,
        CryptoJS.enc.Utf8.parse(aseKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
}


export function decrypt(data){
    return CryptoJS.AES.decrypt(data,
        CryptoJS.enc.Utf8.parse(aseKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
}
