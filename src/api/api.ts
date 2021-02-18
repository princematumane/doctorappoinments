import EventEmitter from "events";
import { CloudAppResponse, Doctor, Patient, userInfo } from "./model/Interface";





export class API extends EventEmitter {
    hostURL: string = "https://doctorappoinmentsapi20210218230626.azurewebsites.net";
    bearerToken: string ="";
    headers: any = { 'Content-Type': 'application/json' };

     tempLoggedUserInfo = {
        name :"",
        surname:"",
        idNumber:0,
        jwt:''
    }

loggedUserInfo : userInfo  = this.tempLoggedUserInfo;
  constructor() {
    super();
  }

  loadUserInfo = async () => {
    let userInfo = await localStorage.getItem('userInfo')
    if (userInfo) {
      if ((userInfo)) { this.loggedUserInfo = JSON.parse(userInfo); }
    }
  }

  storeUserInfo = async (userInfo: userInfo) => {
    let store = {}
    if (userInfo.jwt.length > 10) { 
        this.loggedUserInfo = userInfo;
        this.bearerToken = this.loggedUserInfo.jwt;
        await localStorage.setItem('userInfo', JSON.stringify(store));
    } else {
      this.loggedUserInfo = this.tempLoggedUserInfo;
    }
  }
  logOut = async() =>{
    await localStorage.removeItem('userInfo');
  }

  async getAllDoctors(): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + '/api/Doctors/getAll', {
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