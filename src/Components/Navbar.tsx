import * as React from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "./dashboard/button";
import { api } from '../api/api';
interface State {
    userNameLogged: string
}
interface Props { }

const Logo = styled(Link)`
    font-size: 32px; 
    color: ${({ theme }) => theme.focusColor};
    border-radius: 8px;
    padding:0;
    transition: all 0.2s linear;

    :focus {
        outline: none;
    }

    :hover {
        opacity: 0.7;
    }
    :active {
        transition: all 0.05s linear;
    }`;
const NavbarMainContainer = styled.div`
    margin: 0 auto;
    background: ${({ theme }) => theme.gradient};
    color: ${({ theme }) => theme.text};
    padding: 0;
    display: flex;
    flex-direction: row;
    user-select: none;
    
    div.logoContainer {
        height: 80px;
        overflow: hidden;
        border-top-left-radius: ${({ theme }) => theme.radius};
        padding: 0; margin: 0; white-space: nowrap;
    }
        
    div.rightContainer{
        position: absolute;
        flex: 0; white-space: nowrap;
        margin-top: 25px;
        height: 42px;
        margin-right: 20px;
        right:0px;
    }
    border-top-left-radius: ${({ theme }) => theme.radius};
    border-top-right-radius: ${({ theme }) => theme.radius};
    
     .navbuttons {
        padding: 12px 10px;
        transition: all 0.2s;
        color: ${({ theme }) => theme.bodyAlt};
    }
    .navbuttons:hover {
        border-bottom: 2px solid  ${({ theme }) => theme.bodyAlt};
        color: ${({ theme }) => theme.bodyAlt};
    }

    .navbuttons:active {
        background: ${({ theme }) => theme.bodyAlt};
        color: ${({ theme }) => theme.brandSpot};
    }
`;

export class Navbar extends React.Component<Props, State> {

    state: State = {
        userNameLogged: 'Prince'
    }
    constructor(Props: Props) {
        super(Props);
    }
    componentDidMount(): void {
        this.setState({userNameLogged:(api.loggedUserInfo.name != '')?api.loggedUserInfo.name:'login'})
    }
    componentWillMount(): void {
    }

    logo() {
        return <div className='logoContainer'>
            <Logo to='/'>
                <img src='/logo192.png' height='80px' />
            </Logo>
        </div >
    }
    render() {
        return (
            <NavbarMainContainer>
                <div className='logo'>
                    {this.logo()}
                </div>
                <div className='rightContainer' style={{ display: 'inline-flex' }}>
                    {(this.state.userNameLogged == 'login')?
                     <Button roundimg={''} text={this.state.userNameLogged} onClick={() => {
                        window.location.href = '/Login';
                    }} />
                    :
                    <Button roundimg={''} text={this.state.userNameLogged} onClick={() => {
                        alert("already logged");
                    }} />}
                    <div style={{ flex: 0, whiteSpace: 'nowrap', paddingLeft: 13 }}>
                        <a className='navbuttons navbuttonRed' href='#' onClick={() => { }}><i style={{ marginTop: '10px' }} className=''></i></a>
                    </div>
                </div>
            </NavbarMainContainer>

        );
    }
}
