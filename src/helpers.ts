import { promises } from "dns";

export async function getBase64(e: any): Promise<string> {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        return reader.result;
    };
    reader.onerror = function (error) {
        return 'error';
    };
    return 'error';
}

export function ValidateIdNumber(idNumber: string) {
    const IdExpression = "(?<Year>[0-9][0-9])(?<Month>([0][1-9])|([1][0-2]))(?<Day>([0-2][0-9])|([3][0-1]))(?<Gender>[0-9])(?<Series>[0-9]{3})(?<Citizenship>[0-9])(?<Uniform>[0-9])(?<Control>[0-9])";
    var regexp = new RegExp(IdExpression);
    var cc = regexp.test(idNumber);
    return regexp.test(idNumber);;
}
export function ValidateSouthAfricanPhonenumber(phoneNumber: string) {
    const phExpression = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";
    var regexp = new RegExp(phExpression);
    return regexp.test(phoneNumber);
}

export function validEmailAddress(email: string): boolean {
    const emailExpression = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    var regexp = new RegExp(emailExpression);
    return regexp.test(email);
}

function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}