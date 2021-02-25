import EventEmitter from "events";
import { Appointment } from "../Components/dashboard/interfaces";
import { CloudAppResponse, Doctor, Patient, userInfo } from "./model/Interface";





export class API extends EventEmitter {
    hostURL: string = "https://doctorappoinmentsapi20210218230626.azurewebsites.net";
    bearerToken: string ="";
    headers: any = { 'Content-Type': 'application/json' };

     tempLoggedUserInfo = {
        name :"",
        surname:"",
        idNumber:0,
        jwt:'',
        accountId:''
    }

loggedUserInfo : userInfo  = this.tempLoggedUserInfo;
  constructor() {
    super();
    setInterval(() =>{
      api.loadUserInfo();
  } , 5000)
  }

  loadUserInfo = async () => {
    let userInfo = await localStorage.getItem('userInfo')
    if (userInfo) {
      if ((userInfo)) {
         this.loggedUserInfo = JSON.parse(userInfo);
         this.bearerToken = this.loggedUserInfo.jwt;
         }
    }
  }

  storeUserInfo = async (userInfo: userInfo) => {
    let store = userInfo;
    if (userInfo.jwt.length > 10) { 
      api.emit("userInfo" , userInfo);
        this.loggedUserInfo = userInfo;
        this.bearerToken = this.loggedUserInfo.jwt;
        await localStorage.setItem('userInfo', JSON.stringify(store));
    } else {
      this.loggedUserInfo = this.tempLoggedUserInfo;
    }
  }
  logOut = async() =>{
    await localStorage.removeItem('userInfo');
    this.loggedUserInfo = this.tempLoggedUserInfo;
    this.bearerToken = '';
  }

  async getAllDoctors(): Promise<CloudAppResponse<any>> {
    console.log(this.bearerToken);
    return await fetch(api.hostURL + '/api/Doctors/getAll', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      console.log(data);
      return data
    }).catch((err) => {
      return err
    })
  }

  async getAllPatients(): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + '/api/Patient/getAll', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + api.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      return data
    }).catch((err) => {
      return err
    })
  }
//appointment
makeAppointment(appointment: Appointment,
  success: (success?: any) => void,
  error: (error?: any) => void) {
    const requestOptions = {
      method: 'POST',
      //  headers: this.headers,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.bearerToken
      },
      body: JSON.stringify(appointment)
    };
    console.log(requestOptions)
  const url = this.hostURL + '/api/Patient/makeAppointment';
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
      success(result)
    })
    .catch((err) => {
      console.log(err)
      error(err);
    });
}

async getMyAppointmentsPatient(): Promise<CloudAppResponse<any>> {
  return await fetch(api.hostURL + '/api/Patient/getMyAppointments', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + api.bearerToken,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(data => {
    return data
  }).catch((err) => {
    return err
  })
}

//appointment doctor 
 
async getMyAppointmentsDoctor(): Promise<CloudAppResponse<any>> {
  return await fetch(api.hostURL + '/api/Doctors/getMyAppointments', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + api.bearerToken,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(data => {
    return data
  }).catch((err) => {
    return err
  })
}
async confirmAppointment(accountId:string , isConfirmed:boolean): Promise<CloudAppResponse<any>> {
  return await fetch(api.hostURL + `/api/Doctors/confirmAppointment?accountId=${accountId}&status=${isConfirmed}` , {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + api.bearerToken,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(data => {
    return data
  }).catch(err => {
    return err
  })
}
async getDetails(): Promise<CloudAppResponse<any>> {
  return await fetch(api.hostURL + '/api/Doctors/getDetails', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + api.bearerToken,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(data => {
    return data
  }).catch((err) => {
    return err
  })
}

  async getDetailsOfPatient(id: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Doctors/getDetailsOfPatient?id=` + id, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + api.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      return data
    }).catch(err => {
      return err
    })
  }

  async deleteDetailsDoctor(accountid: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Doctors/deleteDetails?accountId=` + accountid, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + api.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      return data
    }).catch(err => {
      return err
    })
  }
  updateDetailsDoctor(patientToAdd: Patient,
    success: (success?: any) => void,
    error: (error?: any) => void) {
    const requestOptions = {
      method: 'PATCH',
       headers: {
           Authorization: 'Bearer ' + this.bearerToken 
      },
      body: JSON.stringify(patientToAdd) //JSON.Parse
    };
    const url = this.hostURL + '/api/Doctors/updateDetails';
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        success(result)
      })
      .catch((err) => {
        console.log(err)
        error(err);
      });
  }

  AddPatient(patientToAdd: Patient,
    success: (success?: any) => void,
    error: (error?: any) => void) {
    const requestOptions = {
      method: 'POST',
       headers: this.headers,
      body: JSON.stringify(patientToAdd) //JSON.Parse
    };
    const url = this.hostURL + '/api/Patient/create';
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        success(result)
      })
      .catch((err) => {
        console.log(err)
        error(err);
      });
  }

  AddDoctor(doctorToAdd: Doctor,
    success: (success?: any) => void,
    error: (error?: any) => void) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(doctorToAdd) //JSON.Parse
    };
    const url = this.hostURL + '/api/Doctors/create';
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        success(result)
      })
      .catch((err) => {
        console.log(err)
        error(err);
      });
  }

  async UpdatePhoneNumber(userPhoneNumber: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/UserProfile/UpdatePhoneNumber?userPhoneNumber=` + userPhoneNumber, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + api.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then((data) => {
      return data
    }).catch((err) => {
      return err
    })
  }

  async Login(username: string ,password: string): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Login/login?username=${username}&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      console.log(data,"in login")
      return data
    }).catch(err => {
      return err
    })
  }
}

const apiinstance = new API();

const globalAny: any = global;
globalAny.api = apiinstance

export const api = apiinstance;