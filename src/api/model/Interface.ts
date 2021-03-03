export interface CloudAppResponse<T> {
    isSuccessful: boolean;
    message: string;
    data: T;
}

export interface Doctor {
    idNumber: number,
    firstName: string,
    address: string,
    phoneNumber: string,
    specialiazation: string[],
    email: string,
    gender: string,
    surname: string,
    picture: string,
    password: string,
}
export interface Patient {
    idNumber: number,
    firstName: string,
    phoneNumber: string,
    address: string,
    email: string,
    gender: string,
    surname: string,
    picture: string,
    password: string,
}

export interface userInfo {
    name: string,
    jwt: string,
    surname: string,
    idNumber: number
    accountId: string
}
export interface tokenDetails {
    a: string,
    exp?: string,
    isDoctor: string,
    admin: string
}