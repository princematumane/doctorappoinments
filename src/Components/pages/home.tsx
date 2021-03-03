import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Doctor, tokenDetails } from '../../api/model/Interface';
import { getBase64 } from '../../helpers';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Appointment, DoctorAppointed, Doctors } from '../dashboard/interfaces';
import Modal from '../modal/modal';
import { Dropdown, DropdownInterface } from '../select/dropdown';


// tslint:disable-next-line: no-empty-interface
interface Props { match: { params: { id: string } } }

interface State {
    doctors: Doctors[],
    filteredDoctors: Doctors[],
    doctor: Doctors,
    isBookingAppointment: boolean,
    appointmentDetails: Appointment,
    status: boolean,
    message: string,
    tokenDetails: tokenDetails,
    onUpdateDoctorDetails: boolean,
    oldDoctorDetails: Doctor
}

const Maincontainter = styled.div`
height: 100%;
position:fixed;
width: 100%;
    .center{
        position: absolute;
        top: 150px;
        left: 150px;
        width: 80%;
        height: 100%;
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
export class Home extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            doctors: [],
            doctor: this.tempDoctor,
            isBookingAppointment: false,
            appointmentDetails: this.tempAppointmentDetails,
            status: false,
            message: '',
            tokenDetails: api.tempTokenDetails,
            filteredDoctors: [],
            onUpdateDoctorDetails: false,
            oldDoctorDetails: this.tempPersonDetails
        }
    }
    tempDoctor: Doctors = {
        age: 0,
        description: '',
        firstName: '',
        picture: '',
        specialiazation: [],
        surname: '',
        contact: { Email: '', phoneNumber: 0 },
        hospital: '',
        userId: ''
    }
    tempAppointmentDetails: Appointment = {
        description: '',
        dateAndTime: new Date().toISOString(),
        doctorAccountId: '',
        patientAccountId: ''
    }
    tempPersonDetails: Doctor = {
        specialiazation: [],
        hospitalAddress: "",
        email: "",
        firstName: '',
        gender: 'notSpecified',
        idNumber: 0,
        password: '',
        phoneNumber: '',
        picture: "",
        surname: '',
    }
    genderOptions: DropdownInterface[] = [{ value: 'male', option: 'Male' }, { value: 'female', option: 'Female' }];
    ddYYMM = new Date();
    componentDidMount() {
        this.getDoctors();
        api.on("tokenDetails", (tokenDetails: tokenDetails) => {
            this.setState({ tokenDetails: tokenDetails });
        });
        document.title = 'Home';
        console.log('props', this.props)
    }

    getDoctors() {
        api.getAllDoctors().then((data) => {
            console.log(data)
            this.setState({ doctors: data.data }, () => {
                this.setState({ filteredDoctors: this.state.doctors });
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
        var filteredData = this.state.filteredDoctors.filter((d: Doctors) => {
            var newD = d.firstName.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = (d.firstName) ? d.surname : '';
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ doctors: filteredData }, () => { })
        return filteredData;
    }

    filterBySpecialiazation(text: string) {
        var filteredData = this.state.filteredDoctors.filter((d: Doctors) => {
            var newD = d.firstName.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = d.specialiazation;
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ doctors: filteredData }, () => { })
        return filteredData;
    }
    setDoctorToBook(data: Doctors) {
        this.setState({ doctor: data }, () => {
            this.setState({ isBookingAppointment: true }, () => {
                this.setState({ appointmentDetails: { ...this.state.appointmentDetails, doctorAccountId: this.state.doctor.userId } });
            })
        })
    }
    render() {

        if (this.state.status) {
            setTimeout(() => {
                this.setState({ status: false });
                this.setState({ message: '' })
            }, 5000)
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
                            <span>Proffession</span>
                            <Input onChange={(e: any) => {
                                this.filterBySpecialiazation(e.target.value);
                            }} />
                        </div>
                        <div className={"filterSection"}>
                            <span>Hospital</span>
                            <Input />
                        </div>
                    </div>
                    {(this.state.isBookingAppointment) ? <div style={{ width: '50%' }}>
                        <Modal style={{ height: '100%' }} onChange={() => {
                            this.setState({ isBookingAppointment: false });
                        }} id={this.state.doctor.firstName} isOpen={this.state.isBookingAppointment} title={'Book your appointment with ' + this.state.doctor.firstName}>
                            <h4 style={{ textAlign: 'center' }}>Please fill the details below</h4>
                            <div className="doctorDetails">
                                <span>Choose date</span>
                                <div style={{ display: 'inline' }}>
                                    <Input type={'date'} onChange={(e) => {
                                        this.ddYYMM = new Date(e.target.value);
                                    }} />
                                    <Input type={'time'} onChange={(e) => {
                                        console.log(e.target.value);
                                        var minAndSeconds = e.target.value.split(':');
                                        var min = new Date(this.ddYYMM).setHours(parseInt(minAndSeconds[0]));
                                        var sec = new Date(this.ddYYMM).setMinutes(parseInt(minAndSeconds[1]));
                                        this.ddYYMM = new Date(new Date(this.ddYYMM).setHours(parseInt(minAndSeconds[0])));
                                    }} />
                                </div>
                                <span>Description </span>
                                <textarea style={{ height: 200, width: '100%' }} draggable={false} onChange={(e) => {
                                    this.setState({ appointmentDetails: { ...this.state.appointmentDetails, description: e.target.value } });
                                }}></textarea>
                                {(this.state.message != '') ? <div style={{ padding: 10, color: this.state.status ? 'green' : 'red' }}>
                                    <span>{this.state.message}</span>
                                </div> : null}
                                <Button text={'Submit'} onClick={() => {
                                    this.setState({ appointmentDetails: { ...this.state.appointmentDetails, patientAccountId: api.loggedUserInfo.accountId } });
                                    this.setState({ appointmentDetails: { ...this.state.appointmentDetails, dateAndTime: this.ddYYMM.toISOString() } });
                                    this.setState({ appointmentDetails: { ...this.state.appointmentDetails, doctorAccountId: this.state.doctor.userId } });
                                    api.makeAppointment(this.state.appointmentDetails, succes => {
                                        this.setState({ status: succes.status }, () => {
                                            if (this.state.status) {
                                                api.emit('getMyAppointments');
                                            }
                                        });
                                        this.setState({ message: succes.message })
                                    }, err => { })
                                    console.log(this.state.appointmentDetails);
                                }} />
                            </div>

                        </Modal>
                    </div> : null}

                    {(this.state.onUpdateDoctorDetails) ?
                        <Modal
                            onChange={() => { this.setState({ onUpdateDoctorDetails: false }) }}
                            key={JSON.stringify(this.state.oldDoctorDetails)}
                            isOpen={this.state.onUpdateDoctorDetails}
                            title={"Update Details for Doctor" + this.state.oldDoctorDetails.firstName}
                            id={this.state.oldDoctorDetails.firstName} >
                            <>
                                <span>first Name</span>
                                <Input value={this.state.oldDoctorDetails.firstName} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, firstName: e.target.value } })
                                }} />
                                <span>surname</span>
                                <Input value={this.state.oldDoctorDetails.surname} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, surname: e.target.value } })
                                }} />
                                <span>ID Number</span>
                                <Input value={this.state.oldDoctorDetails.idNumber} type={'number'} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, idNumber: e.target.value } })
                                }} />
                                <span>Phone Number</span>
                                <Input value={this.state.oldDoctorDetails.phoneNumber} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, phoneNumber: e.target.value } })
                                }} />
                                <span>Specialiazation</span>
                                <Input value={this.state.oldDoctorDetails.specialiazation} placeholder={'dentist,Psychiatrist,Dermatologist'} onChange={(e: any) => {
                                    let sp = e.target.value.split(',');
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, specialiazation: sp } })
                                }} />
                                <span>email</span>
                                <Input value={this.state.oldDoctorDetails.email} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, email: e.target.value } })
                                }} />
                                <span>Address</span>
                                <Input value={this.state.oldDoctorDetails.hospitalAddress} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, hospitalAddress: e.target.value } })
                                }} />
                                <span>Password</span>
                                <Input value={this.state.oldDoctorDetails.password} onChange={(e: any) => {
                                    this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, password: e.target.value } })
                                }} />
                                <span>Picture</span>
                                <Input type={'file'} onChange={(e: any) => {
                                    getBase64(e).then((data) => {
                                        console.log(data);
                                        if (data !== 'error') {
                                            this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, picture: data } });
                                        }
                                    });
                                }} />
                                <span>gender</span>
                                <div >
                                    <Dropdown style={{ width: "100%" }} dataOptions={this.genderOptions} onChange={(e: any) => {
                                        this.setState({ oldDoctorDetails: { ...this.state.oldDoctorDetails, gender: e } })
                                    }} />
                                </div>

                                <br />
                                {(this.state.message != '') ?
                                    <div style={{ padding: 10, borderRadius: 5, backgroundColor: (this.state.status == true) ? 'green' : 'red' }}>
                                        <span style={{ color: 'white' }}>{this.state.message}</span>
                                    </div>
                                    : null}
                                <Button style={{ width: '102%' }} text='Submit' onClick={() => {
                                    console.log(this.state.oldDoctorDetails)
                                    api.updateDetailsDoctor(this.state.oldDoctorDetails, (success) => {
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
                        <div style={{ display: 'block', width: '100%', overflow: 'auto', height: 500 }}>
                            {(this.state.doctors) ?
                                <table>
                                    <thead>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Surname</th>
                                        <th>Specialiazation</th>
                                        {(api.tokenDetails.admin) ? <th>Delete || Edit</th> : null}
                                    </thead>
                                    <tbody style={{}}>
                                        {(this.state.doctors.map((data, i) => {
                                            return <tr key={i + JSON.stringify(data)}>
                                                <td onClick={() => {
                                                    this.setDoctorToBook(data);
                                                }}>
                                                    <img style={{ width: 50, height: 50 }} src={(data.picture == '' || data.picture == 'string') ? "https://www.vhv.rs/dpng/d/263-2633697_nurse-doctor-icon-png-transparent-png.png" : data.picture} />
                                                </td>
                                                <td onClick={() => {
                                                    this.setDoctorToBook(data);
                                                }}>{data.firstName}</td>
                                                <td onClick={() => {
                                                    this.setDoctorToBook(data);
                                                }}>{data.surname}</td>
                                                <td onClick={() => {
                                                    this.setDoctorToBook(data);
                                                }}>{data.specialiazation.map((s, ii) => {
                                                    return (ii !== data.specialiazation.length - 1) ? <span key={ii}>{s}-</span> : <span key={ii}>{s}</span>;
                                                })}</td>
                                                {(api.tokenDetails.admin) ? <td style={{ textAlign: 'center' }}>
                                                    <FontAwesomeIcon style={{ zIndex: 99, marginRight: 15 }} icon={faTrash} onClick={() => {
                                                        api.deleteDetailsDoctor(data.userId).then((data) => {
                                                            this.getDoctors();
                                                        })
                                                    }} />
                                                    <FontAwesomeIcon style={{ zIndex: 99 }} icon={faPen} onClick={() => {
                                                        api.getDetailsDoctor(data.userId).then((res: any) => {
                                                            this.setState({ oldDoctorDetails: res.data }, () => {
                                                                console.log(this.state.oldDoctorDetails)
                                                                this.setState({ onUpdateDoctorDetails: true });
                                                            })
                                                        })

                                                    }} />
                                                </td> : null}
                                            </tr>
                                        }))}
                                    </tbody>
                                </table>
                                : <span>No doctors</span>}
                        </div>
                    </div>

                </div>
            </Maincontainter>

        )
    }
}
