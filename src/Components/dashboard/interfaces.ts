export interface User {
    name: string
}

export interface Doctors{
    firstName: string , 
    surname:string , 
    specialiazation:string[],
    picture:string,
    age:number,
    contact?:Contact,
    description:string
    hospital?:string
}
export interface Contact{
    phoneNumber?:number,
    Email:string
}

export interface Patient{
    name: string , 
    surname:string , 
    idNumber:number,
    Address:string,
    description:string
    hospital?:string
    contact: Contact
}
