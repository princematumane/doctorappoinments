import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Appointment, DoctorAppointed, Doctors } from '../dashboard/interfaces';
import Modal from '../modal/modal';


// tslint:disable-next-line: no-empty-interface
interface Props { match: { params: { id: string } } }

interface State { doctors: Doctors[], doctor: Doctors, isBookingAppointment: boolean ,
    appointmentDetails: Appointment ,status:boolean,message:string}

const Maincontainter = styled.div`
    .center{
        position: absolute;
        top: 150px;
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
        marginLeft:10px;
        display:inline-flex;
        padding:10px;
    }
    .membersListing{
        padding:20px;
        width:100%;
    }


    table {
        border-collapse: collapse;
        width: 100%;
        background: ${({ theme }) => theme.bodyAltLighter};
      }
      
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      
      table tr:nth-child(even){background-color:  ${({ theme }) => theme.body};}
      
      table tr:hover {background-color: #fff;}
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background: ${({ theme }) => theme.bodyAltLighter};
        color: white;
      }
      tbody{
          width:100%;
      }

`;
export class Home extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { 
            doctors: [],
             doctor: this.tempDoctor, 
             isBookingAppointment: false,
            appointmentDetails:this.tempAppointmentDetails,
            status:false,
            message:''
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
        userId:''
    }
    tempAppointmentDetails: Appointment = {
        description :'',
        dateAndTime: new Date().toISOString(),
        doctorAccountId:'',
        patientAccountId:''
    }
 ddYYMM = new Date();
    componentDidMount() {
        api.getAllDoctors().then((data) => {
            console.log(data)
            this.setState({ doctors: data.data })
        })
        document.title = 'Home';
        console.log('props', this.props)
    }

    bookAppointmentModal() {
        return <div>

        </div>
    }
    render() {

        if(this.state.status){
            setTimeout(() =>{
                this.setState({status:false});
                this.setState({message:''})
            } , 5000)
        }
        return (
            <Maincontainter>
                <div className="center">
                    <div className="searchSection">
                        <div className={"filterSection"}>
                            <span>Name</span>
                            <Input />
                        </div>
                        <div className={"filterSection"}>
                            <span>Proffession</span>
                            <Input />
                        </div>
                        <div className={"filterSection"}>
                            <span>Hospital</span>
                            <Input />
                        </div>
                        <div className={"filterSection"}>
                            <span>Date</span>
                            <Input type={"date"} />
                        </div>
                    </div>
                    {(this.state.isBookingAppointment) ? <div style={{width:'50%'}}>
                        <Modal onChange = {() =>{
                            this.setState({isBookingAppointment:false});
                        }}id={this.state.doctor.firstName} isOpen={this.state.isBookingAppointment} title={'Book your appointment with '+ this.state.doctor.firstName}>
                            <h4 style={{textAlign:'center'}}>Please fill the details below</h4>
                            <div className="doctorDetails">
                            <span>Choose date</span>
                                <div style ={{display:'inline'}}>
                                    <Input type={'date'}  onChange ={(e) =>{
                                        this.ddYYMM = new Date(e.target.value);
                                    }}/>
                                    <Input type={'time'} onChange ={(e) =>{
                                        console.log(e.target.value);
                                        var minAndSeconds = e.target.value.split(':');
                                        var min =  new Date(this.ddYYMM).setHours(parseInt(minAndSeconds[0]));
                                        var sec = new Date(this.ddYYMM).setMinutes(parseInt(minAndSeconds[1]));
                                        this.ddYYMM = new Date(new Date(this.ddYYMM).setHours(parseInt(minAndSeconds[0])));
                                    }}/>
                                </div>
                                <span>Description </span>
                                <textarea style={{height:200 , width:'100%'}} draggable={false} onChange ={(e) =>{
                                       this.setState({appointmentDetails:{...this.state.appointmentDetails,description:e.target.value}});
                                }}></textarea>
                                {(this.state.message != '') ? <div style={{padding:10 , color: this.state.status? 'green' :'red'}}>
                                    <span>{this.state.message}</span>
                                </div> : null}
                                <Button text={'Submit'} onClick={() =>{
                                     this.setState({appointmentDetails:{...this.state.appointmentDetails,patientAccountId:api.loggedUserInfo.accountId}});
                                     this.setState({appointmentDetails:{...this.state.appointmentDetails,dateAndTime:this.ddYYMM.toISOString()}});
                                     this.setState({appointmentDetails:{...this.state.appointmentDetails,doctorAccountId:this.state.doctor.userId}});
                                     api.makeAppointment(this.state.appointmentDetails ,succes =>{
                                         this.setState({status:succes.status} , () =>{
                                             if(this.state.status){
                                                 api.emit('getMyAppointments');
                                             }
                                         });
                                         this.setState({message:succes.message})
                                     } , err =>{})
                                     console.log(this.state.appointmentDetails);
                                }}/>
                            </div>

                        </Modal>
                         </div> : null}
                    <div className={"membersListing"}>
                        <div style={{ display: 'inline-flex', width: '100%' }}>
                            {(this.state.doctors) ?
                                <table>
                                    <thead>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Surname</th>
                                        <th>Specialiazation</th>
                                    </thead>
                                    <tbody>
                                        {(this.state.doctors.map((data, i) => {
                                            return <tr key={i + JSON.stringify(data)} onClick={() => {
                                                this.setState({ doctor: data }, () => {
                                                    this.setState({ isBookingAppointment: true }, () => {
                                                        this.setState({appointmentDetails:{...this.state.appointmentDetails,doctorAccountId:this.state.doctor.userId}});
                                                        console.log(this.state.doctor);
                                                    })
                                                })
                                            }}>
                                                <td>
                                                    <img style={{ width: 50, height: 50 }} src={(data.picture == '' || data.picture == 'string') ? "https://www.vhv.rs/dpng/d/263-2633697_nurse-doctor-icon-png-transparent-png.png" : data.picture} />
                                                </td>
                                                <td>{data.firstName}</td>
                                                <td>{data.surname}</td>
                                                <td>{data.specialiazation.map((s, ii) => {
                                                    return s + ','
                                                })}</td>
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
