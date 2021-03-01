import { promises } from "dns";

export async function getBase64(e: any): Promise<string> {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        return reader.result;
    };
    reader.onerror = function (error) {
        //console.log('error', reader.result, error);
        return 'error';
    };
    //console.log('hepler', reader.result, reader);
    return 'error';
}