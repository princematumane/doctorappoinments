
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { dateArranger } from '../../helpers';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Appointment } from '../dashboard/interfaces';
import Modal from '../modal/modal';
import { Dropdown } from '../select/dropdown';


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
interface State {
    apppointments: any[],
    isManagingAppointment: boolean,
    patientDetails: any,
    appointmentToManage: any,
    appStatus: string,
    pricesAndDescriptions: any[]
}

export interface DropdownInterface {
    value: string,
    option: string
}
const appointmentStatus: DropdownInterface[] = [
    { option: 'Confirmed', value: 'Confirmed' }, { option: 'Waiting', value: 'Waiting' }, { option: 'Declined', value: 'Declined' }
]
export default class ManageAppointments extends React.Component {

    state: State = {
        apppointments: [],
        isManagingAppointment: false,
        patientDetails: "",
        appointmentToManage: "",
        appStatus: "Unknown",
        pricesAndDescriptions: []
    }
    componentDidMount() {
        document.title = 'Manage Appointments';
        const url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);
        console.log('xxx Appointments', id);
        api.getMyAppointmentsDoctor().then((res) => {
            if (res.status) {
                console.log(res.data);
                this.setState({ apppointments: res.data });
            }
        })
    }

    render() {
        return (
            <Maincontainter>
                <div className="center">

                    {(this.state.isManagingAppointment) ?
                        <Modal title={"Manage appoitntment with " + this.state.appointmentToManage.patientDetails.name + ' [ ' + this.state.appStatus + ' ]'} id={api.tokenDetails.a} isOpen={this.state.isManagingAppointment} onChange={() => { }}>
                            <span>Prescription </span>
                            <Input placeholder={' '} onChange={(e: any) => {
                                let sp = e.target.value.split(',');
                            }} /><br />
                            <Input placeholder={'Total price'} onChange={(e: any) => {
                                let sp = e.target.value.split(',');
                            }} />
                            <span>Update Status</span><br />
                            <Dropdown dataOptions={appointmentStatus} onChange={(data: any) => {
                                this.setState({ appStatus: data })
                            }} />

                            <Button text={'Submit'} onClick={() => {
                                //window.location.href = '/payments/' + this.state.appointmentToManage.appId;
                            }} />
                        </Modal> : null}
                    <div className={"membersListing"}>
                        <div style={{ display: 'block', width: '100%', overflow: 'auto', height: 350 }}>
                            {(this.state.apppointments) ?
                                <table>
                                    <thead>
                                        <th>Patient Names</th>
                                        <th>Date and time</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                    </thead>
                                    <tbody>
                                        {(this.state.apppointments.map((data, i) => {
                                            return <tr key={i + JSON.stringify(data)} onClick={() => {
                                                this.setState({ appointmentToManage: data })
                                                this.setState({ patientDetails: data.patientDetails }, () => {
                                                    this.setState({ appStatus: data.confirmed })
                                                    this.setState({ isManagingAppointment: !this.state.isManagingAppointment })
                                                })
                                            }}>
                                                <td>{data.patientDetails.name}</td>
                                                <td>{dateArranger(data.dateAndTime)}</td>
                                                <td>{data.confirmed}</td>
                                                <td>{data.description}</td>
                                            </tr>
                                        }))}
                                    </tbody>
                                </table>
                                : <span>No Patients</span>}
                        </div>
                    </div>

                </div>
            </Maincontainter>
        );
    };
}