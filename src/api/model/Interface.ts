export interface CloudAppResponse<T> {
    isSuccessful: boolean;
    message: string;
    data: T;
}

export interface Doctor{
    idNumber:number,
    firstName:string,
    specialiazation:string[],
    lastName:string,
    phoneNumber:string,
    address:string,
    email:string,
    gender:string,
    surname:string,
    picture:string,
    password:string,
}
export interface Patient{
    idNumber:number,
    firstName:string,
    lastName:string,
    phoneNumber:string,
    address:string,
    email:string,
    gender:string,
    surname:string,
    picture:string,
    password:string,
}

export interface userInfo{
    name:string,
    jwt:string,
    surname:string , 
    idNumber:number
}