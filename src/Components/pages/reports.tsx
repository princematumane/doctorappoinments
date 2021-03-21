import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import { api } from "../../api/api";
import { dateArranger } from "../../helpers";
import { Button } from "../dashboard/button";
import { Input } from "../dashboard/input";
import { CSVLink, CSVDownload } from "react-csv";

interface State {
    appointments: any[],
    filteredAppointments: any[],
    csvData: any[],
    isMakingCsv: boolean
}

interface Props {

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
export default class Reports extends React.Component<Props, State> {

    state: State = {
        appointments: [],
        filteredAppointments: [],
        csvData: [],
        isMakingCsv: false
    }
    componentDidMount() {
        console.log(window.location.href)
        if (api.tokenDetails.admin) {
            api.getAllAppointments().then((res) => {
                if (res.status) {
                    this.setState({ appointments: res.data }, () => {
                        console.log(this.state.appointments);
                        this.setState({ filteredAppointments: this.state.appointments })
                    })
                }
            })
        }
    }
    filterByNameDoctor(text: string) {
        var filteredData = this.state.filteredAppointments.filter((d: any) => {
            var newD = d.doctorDetails.name.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = (d.doctorDetails.name) ? d.doctorDetails.surname : '';
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ appointments: filteredData }, () => { })
        return filteredData;
    }
    filterByNamePatient(text: string) {
        var filteredData = this.state.filteredAppointments.filter((d: any) => {
            var newD = d.patientDetails.name.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = (d.patientDetails.name) ? d.patientDetails.surname : '';
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ appointments: filteredData }, () => { })
        return filteredData;
    }
    filterByStatus(text: string) {
        var filteredData = this.state.filteredAppointments.filter((d: any) => {
            var newD = d.confirmed.toString().toLowerCase().includes(text.toLowerCase());
            if (!newD) {
                var customNameTemp = (d.confirmed) ? d.confirmed : '';
                newD = customNameTemp.toString().toLowerCase().includes(text.toLowerCase());
            }
            return newD
        });
        this.setState({ appointments: filteredData }, () => { })
        return filteredData;
    }
    render() {
        return (
            <Maincontainter>
                <div className="center">

                    <div style={{ marginLeft: 20 }} onClick={() => {
                        var dd: any[] = [];
                        dd[0] = ["Doctor Name", "Patient Name", "Status", "Description", "Date"];
                        this.state.appointments.map((data, index) => {
                            dd[index + 1] = [data.doctorDetails.name, data.patientDetails.name, data.confirmed, data.description, dateArranger(data.dateAndTime)]
                        })
                        this.setState({ csvData: dd }, () => {
                            console.log(this.state.csvData);
                            this.setState({ isMakingCsv: true })
                        });
                    }}>
                        click me to get csv ready
                        {/* <Button text="Export CSV" /> */}
                        {(this.state.isMakingCsv) ? <CSVLink data={this.state.csvData}>Export CSV</CSVLink> : null}

                    </div>
                    <div className="searchSection">
                        <div className={"filterSection"}>
                            <span>Doctor Name</span>
                            <Input onChange={(e: any) => {
                                this.filterByNameDoctor(e.target.value);
                            }} />
                        </div>
                        <div className={"filterSection"}>
                            <span>Patient Name</span>
                            <Input onChange={(e: any) => {
                                this.filterByNamePatient(e.target.value);
                            }} />
                        </div>

                        <div className={"filterSection"}>
                            <span>Status</span>
                            <Input onChange={(e: any) => {
                                this.filterByStatus(e.target.value);
                            }} />
                        </div>
                        <div className={"filterSection"}>
                            <span>Date</span>
                            <Input onChange={(e: any) => {
                                //  this.filterByIdNumber(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className={"membersListing"}>
                        <div style={{ display: 'block', width: '100%', overflow: 'auto', height: 300 }}>
                            {(this.state.appointments) ?
                                <table>
                                    <thead>
                                        {/* <th></th> */}
                                        <th>Doctor</th>
                                        <th>Patient</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </thead>
                                    <tbody>
                                        {(this.state.appointments.map((data: any, i) => {
                                            //console.log(data)
                                            return <tr key={i + JSON.stringify(data)}>
                                                <td onClick={() => {
                                                    // this.setDoctorToBook(data);
                                                }}>{data.doctorDetails.name}</td>
                                                <td onClick={() => {
                                                    //this.setDoctorToBook(data);
                                                }}>{data.patientDetails.name}</td>
                                                <td>{data.confirmed}</td>
                                                <td>{dateArranger(data.dateAndTime)}</td>
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
    }
}