export interface User {
    name: string
}

export interface Doctors{
    firstName: string , 
    surname:string , 
    specialiazation:string[],
    picture:string,
    age:number,
    contact:Contact,
    description:string
    hospital?:string
    userId?:any
}
export interface Contact{
    phoneNumber?:number,
    Email?:string
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
export interface Appointment{
    description:string , 
    doctorAccountId:string,
    patientAccountId:string,
    dateAndTime: string
}
export interface DoctorAppointed{
    Name:string ,
    Surname:string ,
    AccountId:string ,
    PhoneNumber:string ,
    Email:string ,
}

export interface PatientAppointed{
    Name:string ,
    Surname:string ,
    AccountId:string ,
    PhoneNumber:string ,
    Email:string ,
}
