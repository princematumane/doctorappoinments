import * as React from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "./dashboard/button";
import { api } from '../api/api';
import { userInfo } from '../api/model/Interface';
import { lightTheme, theme8bo } from '../themes';
import { UserInfo } from 'os';
import { myAppointment } from './dashboard/interfaces';
interface State {
    userLogged: userInfo,
    menuButtonOpen: boolean,
    appointmentMenuOpen:boolean,
    myAppointments:myAppointment[]
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

const NotificationDiv = styled.div`
    padding: 20px;
`;
const UserProfileDiv = styled.div`
    padding: 20px;

    #profileInfoFlex {
        display: flex;
        flex-direction: row;
    }

    #imageUrl {
        width: 68px;
        height: 68px;
    }

    #givenName {
        font-weight: bold;
        color: ${({ theme }) => theme.focusColor};
    }

    #familyName {

    }

    #imageHolder {
        width: 68px;
        height: 68px;
        overflow: hidden;
        border-radius : ${({ theme }) => theme.radius};
    }

    #profileData {
        flex: 1;
        padding-left: 20px;
    }
`;
const MenuPanel = styled.div`
    position: absolute;
    top: 50px;
    right: 0px;
    min-width: 300px;
    background: ${({ theme }) => theme.body};
    border: 2px solid ${({ theme }) => theme.bodyAltLighter};
    color: ${({ theme }) => theme.text};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 2px;
    padding-bottom: 0;
    z-index: 1000;
    #center {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        width: 100px;
        height: 100px;
        background:'red';
    }​
    hr{
        display: block;
        margin-before: 0.5em;
        margin-after: 0.5em;
        margin-start: auto;
        margin-end: auto;
        overflow:hidden;
        border-style: inset;
        border-width: 1px;
     }
`;
export class Navbar extends React.Component<Props, State> {

    tempUserLogged:userInfo =  {
        name:'Login',
        jwt :'',
        idNumber:0,
        surname:'',
        accountId:''
    }
    state: State = {
        userLogged:this.tempUserLogged,
        menuButtonOpen: false,
        appointmentMenuOpen: false,
        myAppointments: []
    }

    private wrapperMenu: any;
    private wrapperNotif: any;
    constructor(Props: Props) {
        super(Props);
        this.setWrapperMenu = this.setWrapperMenu.bind(this);
        this.setWrapperNotif = this.setWrapperNotif.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentDidMount(): void {
        api.on("userInfo" , (data:userInfo) =>{
            this.setState({userLogged:data})
        })
        var loggedInfo = localStorage.getItem("userInfo");
        if(loggedInfo){
            var info = JSON.parse(loggedInfo);
            api.storeUserInfo(info);
            this.setState({userLogged:info});
        }
        api.on("getMyAppointments" , () =>{
            this.getMyAppointments();
        });
     this.getMyAppointments();

    }
    getMyAppointments(){
        api.getMyAppointmentsPatient().then((data) =>{
            this.setState({myAppointments:data.data} , () =>{
                console.log(this.state.myAppointments);
            });
        })
    }
    componentWillUnmount(): void{
        api.removeAllListeners('getMyAppointments');
    }
    componentWillMount(): void {
    }
    setWrapperMenu(menu:any) {
        this.wrapperMenu = menu;
    }
    setWrapperNotif(menu:any) {
        this.wrapperNotif = menu;
    }
    handleClickOutside(event:any) {
        if (this.wrapperMenu && !this.wrapperMenu.contains(event.target)) {
            this.state.menuButtonOpen ? this.setState({menuButtonOpen: false}) : this.setState({});
            this.state.appointmentMenuOpen ? this.setState({appointmentMenuOpen: false}) : this.setState({});
        }
        this.state.appointmentMenuOpen ? this.setState({appointmentMenuOpen: false}) : this.setState({});
       this.state.menuButtonOpen ? this.setState({menuButtonOpen: false}) : this.setState({});
    }
    logo() {
        return <div className='logoContainer'>
            <Logo to='/'>
                <img src='/logo.png' height='80px' />
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
                    {(this.state.userLogged.name == 'login')?
                     <Button roundimg={''}  text={this.state.userLogged.name} onClick={() => {
                        window.location.href = '/Login';
                    }} />
                    :
                    <>
                    <Button   icon={"faBell"} text={"Notification"} onClick={() =>{
                            this.setState({
                                menuButtonOpen: false
                            });
                          this.setState({
                            appointmentMenuOpen: !this.state.appointmentMenuOpen
                        });
                       // this.setState({userNameLogged:'login'})
                    }}/>
                    <Button text={this.state.userLogged.name} onClick={() =>{
                          this.setState({
                            appointmentMenuOpen: false
                        });
                          this.setState({
                            menuButtonOpen: !this.state.menuButtonOpen
                        });
                       // this.setState({userNameLogged:'login'})
                    }}/>
 
                    {(this.state.appointmentMenuOpen)? <MenuPanel>
                        {(this.state.userLogged)? <NotificationDiv>
                           <div>
                               {(this.state.myAppointments.length <1) ? <span style={{textAlign:'center',color:'red'}}>No Appointments</span>: <div>
                               {(this.state.myAppointments.map((data,i) =>{
                                    return <div key={i} style={{marginBottom:5,padding:5,borderRadius:5, background:lightTheme.bodyAltLighter}}>
                                        <span>{i+1} Appointment with {data.doctorDetails.Name} at {data.DateAndTime} for {data.description}</span>
                                    </div>
                               }))}
                               </div>}
                           </div>
                        </NotificationDiv> : <a>No data</a>}
                    </MenuPanel> : null}
                    {(this.state.menuButtonOpen)? <MenuPanel>
                        {(this.state.userLogged)? <UserProfileDiv>
                            <span>Name : {this.state.userLogged.name}</span><br/>
                            <span>Surname : {this.state.userLogged.surname}</span><br/>
                            <span>Id Number : {this.state.userLogged.idNumber}</span><br/>
                            <Button text={'Log Out'} onClick={() =>{
                                api.logOut();
                                this.setState({userLogged: this.tempUserLogged}, () =>{
                                    window.location.href = '/login'
                                })
                            }} />
                        </UserProfileDiv> : <a>No data</a>}
                    </MenuPanel> : null}

                    </>
                    }
                    <div style={{ flex: 0, whiteSpace: 'nowrap', paddingLeft: 13 }}>
                        <a className='navbuttons navbuttonRed' href='#' onClick={() => { }}><i style={{ marginTop: '10px' }} className=''></i></a>
                    </div>
                </div>
            </NavbarMainContainer>

        );
    }
}
