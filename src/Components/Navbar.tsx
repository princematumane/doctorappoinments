import * as React from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "./dashboard/button";
import { api } from '../api/api';
import { tokenDetails, userInfo } from '../api/model/Interface';
import { lightTheme, theme8bo } from '../themes';
import { UserInfo } from 'os';
import { myAppointment } from './dashboard/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faPowerOff, faTimes } from '@fortawesome/free-solid-svg-icons';
import { dateArranger } from '../helpers';
import { MenuItemObject } from './menuitem';
interface State {
    userLogged: userInfo,
    menuButtonOpen: boolean,
    appointmentMenuOpen: boolean,
    myAppointments: myAppointment[],
    tokenDetails: tokenDetails,
    myPicture: string
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
    position: fixed;
    top: 0;
    width: 100%;
    z-index:9;
    div.logoContainer {
        height: 80px;
        overflow: hidden;
        border-top-left-radius: ${({ theme }) => theme.radius};
        padding: 0; margin: 0; white-space: nowrap;
        display:inline-block;
    }
    #logo {
        display: inline-block;
        height: 100%;
        padding-left: 20px;
        margin-top:30px;
        font-weight: 1000;
        color: ${({ theme }) => theme.gradient};
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
        background:${({ theme }) => theme.body};
        padding:10px;
        border-radius:10px;
        margin-right: 20px;
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
    .action{
        background: ${({ theme }) => theme.body};
        padding:5px;
        margin-bottom:3px;
        align-items:center;
        cursor:pointer;
        border-radius:10px;
    }

    .action:hover{
        background: ${({ theme }) => theme.bodyAltLighter};
    }
`;
const UserProfileDiv = styled.div`
    padding: 20px;

    #profileInfoFlex {
        display: flex;
        flex-direction: row;
    }

    .AdminSection{
        display: flex;
        flex-direction: row;
        text-align:right;
        margin-top: 10px;
    }

    #profileData {
        flex: 1;
        padding-left: 20px;
    }
    .userDetails{
        background: ${({ theme }) => theme.bodyAltLighter};
        margin-top: 10px;
        padding:5px;
        border-radius:10px;
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
    z-index: -1;
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
     .logOutButton{
            cursor: pointer;
            text-align: center;
            margin-top: 30px;
            background-color: #319997; 
            padding: 10px;
            border-radius: 10px;
     }
     .logOutButton:hover{
         opacity:0.7;
     }
`;
export class Navbar extends React.Component<Props, State> {

    tempUserLogged: userInfo = {
        name: 'Login',
        jwt: '',
        idNumber: 0,
        surname: '',
        accountId: ''
    }
    state: State = {
        userLogged: this.tempUserLogged,
        menuButtonOpen: false,
        appointmentMenuOpen: false,
        myAppointments: [],
        tokenDetails: api.tokenDetails,
        myPicture: ''
    }

    private wrapperMenu: any;
    private wrapperNotif: any;
    constructor(Props: Props) {
        super(Props);
        this.wrapperMenu = React.createRef();
        this.setWrapperMenu = this.setWrapperMenu.bind(this);
        this.setWrapperNotif = this.setWrapperNotif.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentDidMount(): void {
        document.addEventListener('mousedown', this.handleClickOutside);
        var pic = localStorage.getItem("myPicture");
        if (pic) {
            this.setState({ myPicture: pic });
        }
        api.on("userInfo", (data: userInfo) => {
            this.setState({ userLogged: data })
        })
        api.on('tokenDetails', (data: tokenDetails) => {
            this.setState({ tokenDetails: data });
        })
        var loggedInfo = localStorage.getItem("userInfo");
        if (loggedInfo) {
            var info = JSON.parse(loggedInfo);
            api.storeUserInfo(info);
            this.setState({ userLogged: info });
        }
        let td = localStorage.getItem("tokenDetails");
        if (td) {
            var d = JSON.parse(td);
            this.setState({ tokenDetails: d });
        }
        api.on("getMyAppointments", () => {
            this.getMyAppointments();
        });
        this.getMyAppointments();
    }

    getBase64(file: any) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    getMyAppointments() {
        if (api.tokenDetails.isDoctor) {
            api.getMyAppointmentsDoctor().then((data) => {
                // console.log('doctor appoinment response ', data);
                this.setState({ myAppointments: data.data }, () => {
                    ///  console.log(this.state.myAppointments);
                });
            })
        } else {
            api.getMyAppointmentsPatient().then((data) => {
                // console.log('patient appoinment response ', data);
                this.setState({ myAppointments: data.data }, () => {
                    //  console.log(this.state.myAppointments);
                });
            })
        }
    }
    componentWillUnmount(): void {
        document.removeEventListener('mousedown', this.handleClickOutside);
        api.removeAllListeners('getMyAppointments');
        api.removeAllListeners('tokenDetails');
        api.removeAllListeners('userInfo');
    }
    componentWillMount(): void {
    }
    setWrapperMenu(menu: any) {
        this.wrapperMenu = menu;
    }
    setWrapperNotif(menu: any) {
        this.wrapperNotif = menu;
    }
    handleClickOutside(event: any) {
        if (this.wrapperMenu && !this.wrapperMenu.current.contains(event.target)) {
            //this.state.menuButtonOpen ? this.setState({ menuButtonOpen: false }) : this.setState({});
            //this.state.appointmentMenuOpen ? this.setState({ appointmentMenuOpen: false }) : this.setState({});
        }
    }
    logo() {
        return <div className='logoContainer'>
            <Logo to='/'>
                <img src='/logo.png' height='80px' />
            </Logo>
        </div >
    }
    menuBtn() {
        const buttonText = this.state.userLogged.name;
        return <div ref={this.setWrapperMenu} style={{ position: 'relative', zIndex: 1 }}>
            {/* <Button
                spot={true}
                roundimg={this.state.myPicture}
                text={buttonText}
                onClick={() => {
                    this.setState({
                        menuButtonOpen: !this.state.menuButtonOpen
                    });
                }} /> */}
            {
                (this.state.menuButtonOpen) && <MenuPanel>
                    {(this.state.userLogged) ? <UserProfileDiv>
                        <div style={{ width: '100%' }} >

                            <div style={{ display: 'inline-block', marginTop: '10px' }}>
                                {(this.state.myPicture && this.state.myPicture != '') ?
                                    <img style={{ width: 100, height: 100 }} src={this.state.myPicture} alt="Doctor Picture" />
                                    :
                                    <img style={{ width: 100, height: 100 }} src={"https://www.vhv.rs/dpng/d/263-2633697_nurse-doctor-icon-png-transparent-png.png"} />
                                }

                            </div>
                            <div style={{ display: 'inline-block' }}>
                                <span>
                                    <span style={{ fontWeight: 'bold' }}>Name :  </span>
                                    {this.state.userLogged.name}</span><br />

                                <span>
                                    <span style={{ fontWeight: 'bold' }}> Surname : </span>
                                    {this.state.userLogged.surname}</span><br />
                                <span>
                                    <span style={{ fontWeight: 'bold' }}>  Id Number : </span>
                                    {this.state.userLogged.idNumber}</span><br />
                                <span>Upload your picture here</span><br />
                                <input type='file' onChange={(e: any) => {
                                    this.getBase64(e.target.files[0]).then((data) => {
                                        var img: any = data;
                                        if (data !== 'error') {
                                            console.log(img);
                                            this.setState({ myPicture: img }, () => {
                                                localStorage.setItem("myPicture", img)
                                            });
                                        }
                                    });
                                }}>
                                </input>
                            </div>
                        </div>
                    </UserProfileDiv> : <a>No data</a>}

                    {(this.state.tokenDetails.admin == 'false' && this.state.tokenDetails.isDoctor == 'false') ?
                        <MenuItemObject icon='fas fa-user' title='Edit Your File' onClick={() => {
                            window.location.href = '/editFile';
                        }} />
                        : null}
                    {(this.state.tokenDetails.admin) ? <>
                        <MenuItemObject icon='fas fa-user' title='Add Doctor' onClick={() => {
                            window.location.href = '/addDoctor';
                        }} />
                        <MenuItemObject icon='fas fa-user' title='Manage Patient' onClick={() => {
                            window.location.href = '/managePatients';
                        }} />
                        <MenuItemObject icon='fas fa-user' title='Reports' onClick={() => {
                            window.location.href = '/reports';
                        }} />
                    </>
                        : null}

                    <div className='logOutButton' onClick={() => {
                        api.logOut().then(() => {
                            this.setState({ userLogged: this.tempUserLogged }, () => {
                                window.location.href = '/login'
                            })
                        });
                    }}>
                        <FontAwesomeIcon icon={faPowerOff} /> Log Out
                    </div>
                    <hr />
                    <hr />
                </MenuPanel>
            }
        </div>
    }
    render() {
        return (
            <NavbarMainContainer>
                <div className='logo'>
                    {this.logo()}
                </div>
                <div id="logo">SAVING LIFE HOSPITAL</div>
                <div className='rightContainer' style={{ display: 'inline-flex' }}>
                    {(this.state.userLogged.name == 'login') ?
                        <Button roundimg={'/unknown.png'} text={this.state.userLogged.name} onClick={() => {
                            window.location.href = '/Login';
                        }} />
                        :
                        <>
                            <div ref={this.wrapperMenu} className={'navbuttons'} onClick={() => {
                                this.getMyAppointments();
                                this.setState({
                                    menuButtonOpen: false
                                });
                                this.setState({
                                    appointmentMenuOpen: !this.state.appointmentMenuOpen
                                });
                            }}>
                                <FontAwesomeIcon icon={faBell} />
                            </div>
                            <Button roundimg={'/user.png'} text={this.state.userLogged.name} onClick={() => {
                                this.setState({
                                    appointmentMenuOpen: false
                                });
                                this.setState({
                                    menuButtonOpen: !this.state.menuButtonOpen
                                });
                                // this.setState({userNameLogged:'login'})
                            }} />
                            {this.menuBtn()}
                            {(this.state.appointmentMenuOpen) ? <MenuPanel>
                                {(this.state.userLogged) ? <NotificationDiv>
                                    <div>
                                        {(this.state.myAppointments.length <= 0) ? <span style={{ textAlign: 'center', color: 'red' }}>No Appointments</span> : <div>
                                            {(this.state.myAppointments.map((data, i) => {
                                                return <div key={i} style={{ marginBottom: 5, padding: 5, borderRadius: 5, background: lightTheme.bodyAltLighter }}>
                                                    {(this.state.tokenDetails.isDoctor) ?
                                                        <div>
                                                            <span> Appointment with  {data.patientDetails.name} {data.patientDetails.surname} </span><br />
                                                            <span> at {dateArranger(data.dateAndTime)} for {data.description}</span>
                                                        </div> :
                                                        <div>
                                                            <span>Appointment with  {data.doctorDetails.name} {data.doctorDetails.surname} </span><br />
                                                            <span> at {dateArranger(data.dateAndTime)} for {data.description}</span>
                                                        </div>
                                                    }
                                                    <span style={{ fontWeight: 'bold' }}>Appointment Status : {data.confirmed}</span>
                                                    {(this.state.tokenDetails.isDoctor && data.confirmed == 'Waiting') ? <div style={{ display: 'inline' }}>
                                                        <div className={'action'} onClick={() => {
                                                            api.confirmAppointment(data.appId, true).then((d) => {
                                                                if (d.status) {
                                                                    alert(d.message + ' ' + data.appId);
                                                                }
                                                            });
                                                            this.getMyAppointments();
                                                        }}>
                                                            <FontAwesomeIcon icon={faCheck} /> Approve
                                                        </div>
                                                        <div className={'action'} onClick={() => {
                                                            api.confirmAppointment(data.appId, false).then((d) => {
                                                                if (d.status) {
                                                                    alert(d.message + ' ' + data.appId);
                                                                }
                                                            });
                                                            this.getMyAppointments();
                                                        }}>
                                                            <FontAwesomeIcon icon={faTimes} /> decline
                                                        </div>
                                                    </div> : null}
                                                </div>
                                            }))}
                                        </div>}
                                    </div>
                                </NotificationDiv> : <a>No data</a>}
                            </MenuPanel> : null}
                        </>
                    }
                </div>
            </NavbarMainContainer>

        );
    }
}
