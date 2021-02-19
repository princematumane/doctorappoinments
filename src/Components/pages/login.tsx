import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { theme8bo } from '../../themes';
import { Button } from '../dashboard/button';
import { Input } from '../dashboard/input';



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
    mode: string,
    username: string,
    password: string,
    status:boolean,
    message:string
}

export class Login extends React.Component {
    state: State = {
        mode: 'login',
        username: '',
        password: '',
        status:false,
        message:''
    }

    componentDidMount() {}
    logginPanel() {
            return (
                <>
                    <span>Username</span>
                    <Input onChange={(e) =>{
                        this.setState({username : e.target.value});
                    }}/>
                        <span>Password</span>
                    <Input type={'password'} onChange={(e) =>{
                        this.setState({password : e.target.value} , () =>{
                            console.log(this.state.password)
                        });
                    }}/><br/>
                    
                    {(this.state.message != '') ? 
                    <div style={{padding:10 , borderRadius:5 , backgroundColor:(this.state.status == true)?'green':'red'}}>
                        <span style={{color:'white'}}>{this.state.message}</span>
                    </div>
                    : null }

                    <Button style={{ width: '102%' }} text='Login' onClick={() => {
                        //api call for login
                        api.Login(this.state.username , this.state.password).then((response:any) =>{
                            this.setState({status:response.status} , () =>{
                                this.setState({message:response.message});
                                if(this.state.status){
                                    api.storeUserInfo(response.data).then(() =>{
                                        window.location.href = "/home";
                                    })
                                      
                                }
                            })
                        })
                    }} />
                    <a onClick = {() =>{
                        window.location.href = "/register"
                    }}>Create account ...</a>
                  </>
            );
    }

    render() {
        return (
            <MainContainer>
                <Panel>
                    <div style={{justifyContent:'center', alignContent:'center',alignSelf:'center',textAlign:'center'}}>
                        <img src='/logo.png' style={{width:'150px' , height:'150px' }}/>
                    </div>
                
                    {this.logginPanel()}
                </Panel>
            </MainContainer>
        )
    }
}
