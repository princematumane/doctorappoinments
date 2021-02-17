import * as React from 'react';
import styled from 'styled-components';
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
    password: string
}

export class Register extends React.Component {
    state: State = {
        mode: 'login',
        username: '',
        password: ''
    }

    componentDidMount() {}
    logginPanel() {
            return (
                <>
                <h1>Register</h1>

                    <span>name</span>
                    <Input />
                    <span>surname</span>
                    <Input/>
                    <span>idnumber</span>
                    <Input type='number' ></Input>
                    <span>address</span>
                    <Input></Input>
                    <span>discription</span>
                    <Input></Input>
                    <span>hospital</span>
                    <Input></Input>
                    <span>contact</span>
                    <Input type='number'></Input>

                        <span>Password</span>
                    <Input type={'password'} onChange={(e) =>{
                        this.setState({password : e.target.value} , () =>{
                            console.log(this.state.password)
                        });
                    }}/><br/>
                    <Button style={{ width: '102%' }} text='Login' onClick={() => {
                        window.open('/');
                        //api call for login
                    }} />
                    
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
