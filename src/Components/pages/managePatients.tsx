import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Doctor, Patient, tokenDetails } from '../../api/model/Interface';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Appointment, DoctorAppointed, Doctors } from '../dashboard/interfaces';
import Modal from '../modal/modal';
import { Dropdown, DropdownInterface } from '../select/dropdown';


// tslint:disable-next-line: no-empty-interface
interface Props { match: { params: { id: string } } }

interface State {
    patients: Patient[],
    filteredPatients: Patient[],
    patient: Patient,
    status: boolean,
    message: string,
    tokenDetails: tokenDetails,
    onUpdatePatientDetails: boolean,
    oldPatientDetails: Patient
}

const Maincontainter = styled.div`
height: 100%;
position:fixed;
width: 100%;
    .center{
        position: absolute;
        top: 100px;
        left: 150px;
        width: 80%;
        height: 80%;
        background: ${({ theme }) => theme.bodyAltLighter};
        border-radius: ${({ theme }) => theme.radius};
    }
    .searchSection{
        padding:30px;
        background: ${({ theme }) => theme.bodyAltLighter};
    }
    .searchSection span{
        padding-right:10px;
    }
    .filterSection{
        marginLeft:5px;
        display:inline-flex;
        padding:5px;
    }
    .membersListing{
        padding:20px;
        width:100%;
    }


    table {
        border-collapse: collapse;
        width: 100%;
        background: ${({ theme }) => theme.bodyAltLighter};
        height:100%;
      }
      
      table td, table th {
        border: 1px solid #ddd;
        padding: 5px;
      }
      
      table tr:nth-child(even){background-color:  ${({ theme }) => theme.body};}
      
      table tr{
        overflow:auto;
        
      }
      table tr:hover {background-color: #fff;}
      
      table th {
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: left;
        background: ${({ theme }) => theme.bodyAltLighter};
        color: white;
      }
      tbody{
          width:100%;
          overflow:scroll;
      }

`;
export class ManagePatients extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            patients: [],
            patient: this.tempPersonDetails,
            status: false,
            message: '',
            tokenDetails: api.tokenDetails ? api.tokenDetails : api.tempTokenDetails,
            filteredPatients: [],
            onUpdatePatientDetails: false,
            oldPatientDetails: this.tempPersonDetails
        }
    }
    tempPersonDetails: Patient = {
        address: "",
        email: "",
        firstName: '',
        gender: '',
        idNumber: 0,
        password: '',
        phoneNumber: '',
        picture: "",
        surname: '',
    }
    genderOptions: DropdownInterface[] = [{ value: 'male', option: 'Male' }, { value: 'female', option: 'Female' }];
    ddYYMM = new Date();
    componentDidMount() {
        var tokenDetails = localStorage.getItem('tokenDetails');
        if (tokenDetails) {
            this.setState({ tokenDetails: api.tokenDetails }, () => {
                console.log('props', this.state.tokenDetails, api.tokenDetails)
                if (this.state.tokenDetails.admin) {
                    this.getAllPatient();
                }
            })
        } else {
            window.location.href = '/login';
        }
        api.on("tokenDetails", (tokenDetails: tokenDetails) => {
            this.setState({ tokenDetails: tokenDetails });
        });
        document.title = 'Manage Patients';
    }

    getAllPatient() {
        console.log("xxxxxxx patient")
        api.getAllPatients().then((data) => {
            console.log("xxxxxxx patient", data)
            var docs = this.state.filteredPatients;
            this.setState({ patients: data.data }, () => {
                //this.setState({ filteredDoctors: this.state.doctors });
            })
        });
    }
    componentWillUnmount() {
        api.removeAllListeners("tokenDetails");
    }

    bookAppointmentModal() {
        return <div>

        </div>
    }

    filterByName(text: string) {
        var filteredData = this.state.filteredPatients.filter((d: Patient) => {
            var newD = d.firstName.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = (d.firstName) ? d.surname : '';
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ patients: filteredData }, () => { })
        return filteredData;
    }

    filterByIdNumber(text: string) {
        var filteredData = this.state.filteredPatients.filter((d: Patient) => {
            var newD = d.firstName.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = d.idNumber;
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ patients: filteredData }, () => { })
        return filteredData;
    }
    getBase64(file: any) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    render() {

        if (this.state.status) {
            setTimeout(() => {
                this.setState({ status: false });
                this.setState({ message: '' })
            }, 5000)
        }
        if (this.state.tokenDetails == api.tempTokenDetails) {
            return <Maincontainter>
                <div>
                    <span>This page is for logged users</span>
                </div>
            </Maincontainter>
        }
        return (
            <Maincontainter>
                <div className="center">
                    <div className="searchSection">
                        <div className={"filterSection"}>
                            <span>Name</span>
                            <Input onChange={(e: any) => {
                                this.filterByName(e.target.value);
                            }} />
                        </div>
                        <div className={"filterSection"}>
                            <span>ID Number</span>
                            <Input onChange={(e: any) => {
                                this.filterByIdNumber(e.target.value);
                            }} />
                        </div>
                    </div>
                    {(this.state.onUpdatePatientDetails) ?
                        <Modal
                            onChange={() => { this.setState({ onUpdatePatientDetails: false }) }}
                            key={JSON.stringify(this.state.oldPatientDetails)}
                            isOpen={this.state.onUpdatePatientDetails}
                            title={"Update Details for Doctor" + this.state.oldPatientDetails.firstName}
                            id={this.state.oldPatientDetails.firstName} >
                            <>
                                <span>first Name</span>
                                <Input value={this.state.oldPatientDetails.firstName} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, firstName: e.target.value } })
                                }} />
                                <span>surname</span>
                                <Input value={this.state.oldPatientDetails.surname} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, surname: e.target.value } })
                                }} />
                                <span>ID Number</span>
                                <Input value={this.state.oldPatientDetails.idNumber} type={'number'} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, idNumber: e.target.value } })
                                }} />
                                <span>Phone Number</span>
                                <Input value={this.state.oldPatientDetails.phoneNumber} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, phoneNumber: e.target.value } })
                                }} />
                                {/* <span>Prescription</span>
                                <Input value={this.state.oldPatientDetails.prescription} placeholder={'dentist,Psychiatrist,Dermatologist'} onChange={(e: any) => {
                                    let sp = e.target.value.split(',');
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, specialiazation: sp } })
                                }} /> */}
                                <span>email</span>
                                <Input value={this.state.oldPatientDetails.email} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, email: e.target.value } })
                                }} />
                                <span>Address</span>
                                <Input value={this.state.oldPatientDetails.address} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, address: e.target.value } })
                                }} />
                                <span>Password</span>
                                <Input value={this.state.oldPatientDetails.password} onChange={(e: any) => {
                                    this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, password: e.target.value } })
                                }} />
                                <span>Picture</span>
                                <Input type={'file'} onChange={(e: any) => {
                                    this.getBase64(e.target.files[0]).then((data) => {
                                        var img: any = data;
                                        if (data !== 'error') {
                                            console.log(img);
                                            this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, picture: img } });
                                        }
                                    });
                                }} />
                                <span>gender</span>
                                <div >
                                    <Dropdown style={{ width: "100%" }} dataOptions={this.genderOptions} onChange={(e: any) => {
                                        this.setState({ oldPatientDetails: { ...this.state.oldPatientDetails, gender: e } })
                                    }} />
                                </div>

                                <br />
                                {(this.state.message != '') ?
                                    <div style={{ padding: 10, borderRadius: 5, backgroundColor: (this.state.status == true) ? 'green' : 'red' }}>
                                        <span style={{ color: 'white' }}>{this.state.message}</span>
                                    </div>
                                    : null}
                                <Button style={{ width: '102%' }} text='Submit' onClick={() => {
                                    console.log(this.state.oldPatientDetails)
                                    api.updateDetailsPatient(this.state.oldPatientDetails, (success) => {
                                        console.log("details", success);
                                        this.setState({ status: success.status }, () => {
                                            this.setState({ message: success.message })
                                            if (this.state.status) {
                                                // window.location.href = "/home";
                                            }
                                        })
                                    }, err => { })
                                }} />

                            </>

                        </Modal>

                        : null}
                    <div className={"membersListing"}>
                        <div style={{ display: 'block', width: '100%', overflow: 'auto', height: 350 }}>
                            {(this.state.patients) ?
                                <table>
                                    <thead>
                                        {/* <th></th> */}
                                        <th>Name</th>
                                        <th>Surname</th>
                                        <th>Id number</th>
                                        {(api.tokenDetails.admin) ? <th>Delete || Edit</th> : null}
                                    </thead>
                                    <tbody>
                                        {(this.state.patients.map((data, i) => {
                                            console.log(data)
                                            return <tr key={i + JSON.stringify(data)}>
                                                {/* <td onClick={() => {
                                                    // this.setDoctorToBook(data);
                                                }}>

                                                    {(data.picture == '' || data.picture == 'string') ?
                                                        <img style={{ width: 50, height: 50 }} src={"https://www.vhv.rs/dpng/d/263-2633697_nurse-doctor-icon-png-transparent-png.png"} />
                                                        :
                                                        <img style={{ width: 50, height: 50 }} src={data.picture} alt="Patient Picture" />
                                                    }

                                                </td> */}
                                                <td onClick={() => {
                                                    // this.setDoctorToBook(data);
                                                }}>{data.firstName}</td>
                                                <td onClick={() => {
                                                    //this.setDoctorToBook(data);
                                                }}>{data.surname}</td>
                                                <td>{data.idNumber}</td>
                                                {(api.tokenDetails.admin) ? <td style={{ textAlign: 'center' }}>
                                                    <FontAwesomeIcon style={{ zIndex: 99, marginRight: 15 }} icon={faTrash} onClick={() => {
                                                        api.deleteDetailsPatient(data.userId).then((data) => {
                                                            this.getAllPatient();
                                                        })
                                                    }} />
                                                    <FontAwesomeIcon style={{ zIndex: 99 }} icon={faPen} onClick={() => {
                                                        api.getDetailsOfPatient(data.userId).then((res: any) => {
                                                            this.setState({ oldPatientDetails: res.data }, () => {
                                                                console.log(this.state.oldPatientDetails)
                                                                this.setState({ onUpdatePatientDetails: true });
                                                            })
                                                        })

                                                    }} />
                                                </td> : null}
                                            </tr>
                                        }))}
                                    </tbody>
                                </table>
                                : <span>No Patients</span>}
                        </div>
                    </div>

                </div>
            </Maincontainter>

        )
    }
}
