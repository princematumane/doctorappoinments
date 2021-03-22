export interface User {
    name: string
}

export interface Doctors {
    firstName: string,
    surname: string,
    specialiazation: string[],
    picture: string,
    age: number,
    contact: Contact,
    description: string
    hospital?: string
    userId?: any
}
export interface Contact {
    phoneNumber?: number,
    Email?: string
}

export interface Patient {
    name: string,
    surname: string,
    idNumber: number,
    Address: string,
    description: string
    hospital?: string
    contact: Contact
}
export interface Appointment {
    description: string,
    doctorAccountId: string,
    patientAccountId: string,
    dateAndTime: string
}
export interface myAppointment {
    description: string,
    confirmed: string,
    appId: string,
    dateAndTime: any,
    doctorDetails: DoctorAppointed,
    patientDetails: PatientAppointed
}

export interface DoctorAppointed {
    name: string,
    surname: string,
    accountId: string,
    phoneNumber: string,
    email: string,
}

export interface PatientAppointed {
    name: string,
    surname: string,
    accountId: string,
    phoneNumber: string,
    email: string,
}

export interface DoctorUpdateAppointment {
    totalPrice: string,
    status: string
}