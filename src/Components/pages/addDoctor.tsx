import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Doctor, Patient, tokenDetails } from '../../api/model/Interface';
import { getBase64 } from '../../helpers';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Select } from '../dashboard/select';
import { Dropdown, DropdownInterface } from '../select/dropdown';



const MainContainer = styled.div`
    background: ${({ theme }) => theme.gradient};
    top:0;
    bottom:0;
    left:0;
    right:0;
    position: absolute;
    min-height: 110%;
    z-index: 99;
`;

export const Panel = styled.div`
    margin-top: 50px;
    background: ${({ theme }) => theme.gradient};
    max-width: 40%;
    width: 100%;
    margin: 0px auto;
    padding: 40px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.bodyAltLighter};
    box-shadow: 0px 10px 5px 0px rgba(0,0,0,0.11);
    margin-top: 40px;
    Input{
        height:40px;
    }
    Button{
        margin-top: 10px;
        height:40px;
    }
    Button:Hover{
        background:#7cccbe;
    }
`;

interface State {
    personDetails: Doctor,
    status: boolean,
    message: string,
    tokenDetails: tokenDetails
}


export class AddDoctor extends React.Component {

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
    state: State = {
        personDetails: this.tempPersonDetails,
        status: false,
        message: '',
        tokenDetails: api.tokenDetails
    }
    componentDidMount() {
        api.on('tokenDetails', (data: tokenDetails) => {
            this.setState({ tokenDetails: data });
        });

        let td = localStorage.getItem("tokenDetails");
        if (td) {
            var d = JSON.parse(td);
            this.setState({ tokenDetails: d });
        }
    }
    componentWillUnmount(): void {
        api.removeAllListeners('tokenDetails');
        api.removeAllListeners('userInfo');
    }
    logginPanel() {
        if (!this.state.tokenDetails.admin) {
            // setTimeout(() => {
            //     window.location.href = '/login'
            // }, 4000)
            return (<>
                Not system admin,This page is only for admin
            </>);
        }
        return (
            <>
                <Button text={'< Back'} onClick={() => {
                    window.location.href = "/login";
                }} />
                <h1 style={{ textAlign: 'center' }}>Add Doctor</h1>
                <span>first Name</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, firstName: e.target.value } })
                }} />
                <span>surname</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, surname: e.target.value } })
                }} />
                <span>ID Number</span>
                <Input type={'number'} onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, idNumber: e.target.value } })
                }} />
                <span>Phone Number</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, phoneNumber: e.target.value } })
                }} />
                <span>Specialiazation</span>
                <Input placeholder={'dentist,Psychiatrist,Dermatologist'} onChange={(e: any) => {
                    let sp = e.target.value.split(',');
                    this.setState({ personDetails: { ...this.state.personDetails, specialiazation: sp } })
                }} />
                <span>email</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, email: e.target.value } })
                }} />
                <span>Address</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, hospitalAddress: e.target.value } })
                }} />
                <span>Password</span>
                <Input onChange={(e: any) => {
                    this.setState({ personDetails: { ...this.state.personDetails, password: e.target.value } })
                }} />

                <span>Picture</span>
                <Input type={'file'} onChange={(e: any) => {
                    getBase64(e).then((data) => {
                        console.log(data);
                        if (data !== 'error') {
                            this.setState({ personDetails: { ...this.state.personDetails, pictuer: data } });
                        }
                    });
                }} />

                <span>gender</span>
                <div >
                    <Dropdown style={{ width: "100%" }} dataOptions={this.genderOptions} onChange={(e: any) => {
                        this.setState({ personDetails: { ...this.state.personDetails, gender: e } })
                    }} />
                </div>

                <br />
                {(this.state.message != '') ?
                    <div style={{ padding: 10, borderRadius: 5, backgroundColor: (this.state.status == true) ? 'green' : 'red' }}>
                        <span style={{ color: 'white' }}>{this.state.message}</span>
                    </div>
                    : null}
                <Button style={{ width: '102%' }} text='Submit' onClick={() => {
                    console.log(this.state.personDetails)
                    api.AddDoctor(this.state.personDetails, (success) => {
                        console.log(success);
                        this.setState({ status: success.status }, () => {
                            this.setState({ message: success.message })
                            if (this.state.status) {
                                window.location.href = "/home";
                            }
                        })

                    }, err => { })
                }} />

            </>
        );
    }

    render() {
        return (
            <MainContainer>
                <Panel>
                    {/* <div style={{justifyContent:'center', alignContent:'center',alignSelf:'center',textAlign:'center'}}>
                        <img src='/logo.png' style={{width:'150px' , height:'150px' }}/>
                    </div> */}
                    {this.logginPanel()}
                </Panel>
            </MainContainer>
        )
    }
}
