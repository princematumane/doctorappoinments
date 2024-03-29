export interface CloudAppResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export interface Doctor {
    idNumber: number,
    firstName: string,
    hospitalAddress: string,
    phoneNumber: string,
    specialiazation: string[],
    email: string,
    gender: string,
    surname: string,
    picture: string,
    password: string,
    userId?: string
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
    userId?: any
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