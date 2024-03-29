import EventEmitter from "events";
import { Appointment } from "../Components/dashboard/interfaces";
import { CloudAppResponse, Doctor, Patient, tokenDetails, userInfo } from "./model/Interface";
import jwt_decode from "jwt-decode";




export class API extends EventEmitter {
  hostURL: string = "https://doctorappoinmentsapi20210321201458.azurewebsites.net/";
  //hostURL: string = "https://localhost:5001";
  bearerToken: string = "";
  headers: any = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  tempLoggedUserInfo = {
    name: "",
    surname: "",
    idNumber: 0,
    jwt: '',
    accountId: ''
  }
  tempTokenDetails: tokenDetails = {
    a: '',
    admin: '',
    isDoctor: '',
    exp: ''
  }

  loggedUserInfo: userInfo = this.tempLoggedUserInfo;
  tokenDetails: tokenDetails = this.tempTokenDetails;
  constructor() {
    super();
    setInterval(() => {
      api.loadUserInfo();
    }, 2000)
  }

  loadUserInfo = async () => {
    let userInfo = await localStorage.getItem('userInfo');
    let td = await localStorage.getItem('tokenDetails');
    if (userInfo && td) {
      if ((userInfo) && (td)) {
        this.loggedUserInfo = JSON.parse(userInfo);
        this.bearerToken = this.loggedUserInfo.jwt;
        this.tokenDetails = JSON.parse(td);
      }
    }
    //console.log(userInfo);
    //console.log(td)
  }

  storeUserInfo = async (userInfo: userInfo) => {
    let store = userInfo;
    if (userInfo.jwt.length > 10) {
      var decoded: tokenDetails = jwt_decode(userInfo.jwt);
      api.emit("userInfo", userInfo);
      api.emit("tokenDetails", decoded);
      this.loggedUserInfo = userInfo;
      this.tokenDetails = decoded;
      this.bearerToken = this.loggedUserInfo.jwt;
      await localStorage.setItem('userInfo', JSON.stringify(store));
      await localStorage.setItem('tokenDetails', JSON.stringify(decoded));
    } else {
      this.loggedUserInfo = this.tempLoggedUserInfo;
    }
  }
  logOut = async () => {
    await localStorage.removeItem('userInfo');
    await localStorage.removeItem('tokenDetails');
    await localStorage.removeItem("myPicture");
    await localStorage.removeItem("jwtPacket");
    this.loggedUserInfo = this.tempLoggedUserInfo;
    this.tokenDetails = this.tempTokenDetails;
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
      // console.log(data);
      return data
    }).catch((err) => {
      return err
    })
  }
  //getAllAppointments

  async getAllAppointments(): Promise<CloudAppResponse<any>> {
    console.log(this.bearerToken);
    return await fetch(api.hostURL + '/api/Doctors/getAllAppointments', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      // console.log(data);
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
    appointment.patientAccountId = this.loggedUserInfo.accountId;
    console.log(JSON.stringify(appointment));
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


  async getMyAppointment(appId: string): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Patient/getMyAppointment?appId=${appId}`, {
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
  ///api/Doctors/UpdateAppointment?appId=ertgty&price=ewrtr&status=ertr
  async UpdateAppointment(appId: string, price: string, status?: string): Promise<any> {
    var fulUrl = api.hostURL + `/api/Doctors/UpdateAppointment?appId=${appId}&price=${price}`;
    if (status) {
      fulUrl += `&status=${status}`
    }
    return await fetch(fulUrl, {
      method: 'PATCH',
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
  ///api/Doctors/UpdateAppointment?appId=ertgty&price=ewrtr&status=ertr
  async UpdatePayments(appId: string, price: string): Promise<any> {
    var fulUrl = api.hostURL + `/api/Patient/Payments?id=${appId}&totalCost=${price}`;
    return await fetch(fulUrl, {
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
  async confirmAppointment(appId: string, isConfirmed: boolean): Promise<any> {
    return await fetch(api.hostURL + `/api/Doctors/confirmAppointment?appId=${appId}&status=${isConfirmed}`, {
      method: 'PATCH',
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
  async getDetailsPatient(): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + '/api/Patient/getDetails', {
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

  async DeleteAppointment(id: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Doctors/deleteAppointment?id=` + id, {
      method: 'DELETE',
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
  async getDetailsOfPatient(id: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Doctors/getDetailsOfPatient?id=` + id, {
      method: 'GET',
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

  async deleteDetailsPatient(accountid: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Patient/deleteDetails?accountId=` + accountid, {
      method: 'DELETE',
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
      method: 'DELETE',
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

  async getDetailsDoctor(accountid: any): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Doctors/getDetailsDoctor?userId=` + accountid, {
      method: 'GET',
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

  updateDetailsDoctor(patientToAdd: Doctor,
    success: (success?: any) => void,
    error: (error?: any) => void) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'application/json'
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

  updateDetailsPatient(patientToAdd: Patient,
    success: (success?: any) => void,
    error: (error?: any) => void) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientToAdd) //JSON.Parse
    };
    const url = this.hostURL + '/api/Patient/updateDetails';
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
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'application/json'
      },
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

  async Login(username: string, password: string): Promise<CloudAppResponse<any>> {
    return await fetch(api.hostURL + `/api/Login/login?username=${username}&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      console.log(data, "in login")
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