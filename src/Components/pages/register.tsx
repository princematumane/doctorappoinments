import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Patient } from '../../api/model/Interface';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';
import { Select } from '../dashboard/select';
import { Dropdown, DropdownInterface } from '../select/dropdown';



 const MainContainer = styled.div`
    background: ${({ theme }) => theme.bodyAlt};
    top:0;
    bottom:0;
    left:0;
    right:0;
    position: absolute;
    min-height: 1500;
`;

export const Panel = styled.div`
    margin-top: 50px;
    background: ${({ theme }) => theme.bodyAltLighter};
    max-width: 400px;
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
    personDetails: Patient,
    status: boolean,
    message: string
}


export class Register extends React.Component {

    tempPersonDetails: Patient ={
        address: "",
        email:"",
        firstName:'',
        gender:'',
        idNumber:0,
        lastName:'',
        password:'',
        phoneNumber:'',
        picture:"",
        surname:'',
    }
    genderOptions : DropdownInterface[] = [{value:'male',option:'Male'} , {value:'female',option:'Female'}];
    state: State = {
        personDetails: this.tempPersonDetails,
        status:false,
        message:''
    }


    componentDidMount() {
        
    }
    logginPanel() {
            return (
                <>
                <h1>Create file</h1>
                    <span>first Name</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,firstName:e.target.value}})
                    }} />
                          <span>Last Name</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,lastName:e.target.value}})
                    }} />
                          <span>surname</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,surname:e.target.value}})
                    }} />
                               <span>ID Number</span>
                    <Input type={'number'} onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,idNumber:e.target.value}})
                    }} />
                          <span>Phone Number</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,phoneNumber:e.target.value}})
                    }} />
                               <span>email</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,email:e.target.value}})
                    }} />
                                                <span>Address</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,address:e.target.value}})
                    }} />
                                                 <span>Password</span>
                    <Input onChange = {(e:any) =>{
                        this.setState({personDetails:{...this.state.personDetails,password:e.target.value}})
                    }} />
                       
                          <span>gender</span>
                          <div >
                          <Dropdown dataOptions={this.genderOptions} onChange={(e:any) =>{
                                this.setState({personDetails:{...this.state.personDetails,gender:e}})
                          }}/>
                          </div>
                    
                    <br/>
                    {(this.state.message != '') ? 
                    <div style={{padding:10 , borderRadius:5 , backgroundColor:(this.state.status == true)?'green':'red'}}>
                        <span style={{color:'white'}}>{this.state.message}</span>
                    </div>
                    : null }
                    <Button style={{ width: '102%' }} text='Create File' onClick={() => {
                        console.log(this.state.personDetails)
                        api.AddPatient(this.state.personDetails , (success) =>{
                            console.log(success);
                            this.setState({status:success.status} , () =>{
                                this.setState({message:success.message})
                                if(this.state.status){
                                    window.location.href = "/login";
                                }
                            })
                            
                        } ,  err =>{

                        })
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
