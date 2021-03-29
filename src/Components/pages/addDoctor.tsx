import { faArrowCircleLeft, faEye, faEyeSlash, faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Doctor, Patient, tokenDetails } from '../../api/model/Interface';
import { ValidateIdNumber, ValidateSouthAfricanPhonenumber, validateStrongPassowrd, validEmailAddress } from '../../helpers';
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
    tokenDetails: tokenDetails,
    hospitalAddressValid: boolean,
    emailValid: boolean,
    genderValid: boolean,
    firstNameValid: boolean,
    idNumberValid: boolean,
    passwordValid: boolean,
    phoneNumberValid: boolean,
    surnameValid: boolean,
    pictureValid: boolean,
    confirmPasswordValid: boolean,
    formErrors: any,
    areRequiremetsMet: string,
    showPasswordDecription: boolean
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
        tokenDetails: api.tokenDetails,
        hospitalAddressValid: false,
        emailValid: false,
        genderValid: false,
        firstNameValid: false,
        idNumberValid: false,
        passwordValid: false,
        surnameValid: false,
        phoneNumberValid: false,
        pictureValid: false,
        confirmPasswordValid: false,
        areRequiremetsMet: '',
        formErrors: {
            address: "",
            email: "",
            firstName: '',
            gender: '',
            idNumber: 0,
            password: '',
            phoneNumber: '',
            picture: "",
            surname: '',
            confirmPassword: ''
        },
        showPasswordDecription: false
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
        document.title = 'Add Doctor';
    }
    componentWillUnmount(): void {
        api.removeAllListeners('tokenDetails');
        api.removeAllListeners('userInfo');
    }
    async getBase64(e: any): Promise<string> {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            return reader.result;
        };
        reader.onerror = function (error) {
            return 'error';
        };
        return 'error';
    }


    handleUserInput(e: any) {
        if (this.state.areRequiremetsMet == '') {
            this.setState({ areRequiremetsMet: 'false' })
        }
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ personDetails: { ...this.state.personDetails, [name]: value } }, () => {
            this.validateField(name, value);
        })
    }
    validateField(fieldName: any, value: any) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let hospitalAddressValid = this.state.hospitalAddressValid;
        let firstNameValid = this.state.firstNameValid;
        let idNumberValid = this.state.idNumberValid;
        let surnameValid = this.state.surnameValid;
        let phoneNumberValid = this.state.phoneNumberValid;
        let confirmPasswordValid = this.state.confirmPasswordValid;
        switch (fieldName) {
            case 'email':
                emailValid = validEmailAddress(value);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = validateStrongPassowrd(value);
                fieldValidationErrors.password = passwordValid ? '' : 'Password strength does not match criteria';
                break;
            case 'confirmPassword':
                confirmPasswordValid = value.length >= 5 && this.state.personDetails.password == value;
                fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' is too short or does not match';
                break;
            case 'hospitalAddress':
                hospitalAddressValid = value.length >= 5;
                fieldValidationErrors.hospitalAddress = hospitalAddressValid ? '' : ' is too short';
                break;
            case 'phoneNumber':
                phoneNumberValid = ValidateSouthAfricanPhonenumber(value);
                fieldValidationErrors.phoneNumber = phoneNumberValid ? '' : ' Not valid phone number format';
                break;
            case 'surname':
                surnameValid = value.length >= 3;
                fieldValidationErrors.surname = surnameValid ? '' : ' is too short';
                break;
            case 'firstName':
                firstNameValid = value.length >= 2;
                fieldValidationErrors.firstName = firstNameValid ? '' : ' is too short';
                break;
            case 'idNumber':
                idNumberValid = ValidateIdNumber(value);
                fieldValidationErrors.idNumber = idNumberValid ? '' : 'Not a valid id number';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            hospitalAddressValid: hospitalAddressValid,
            firstNameValid: firstNameValid,
            idNumberValid: idNumberValid,
            surnameValid: surnameValid,
            phoneNumberValid: phoneNumberValid,
            confirmPasswordValid: confirmPasswordValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.emailValid
                && this.state.passwordValid && this.state.hospitalAddressValid && this.state.firstNameValid &&
                this.state.idNumberValid && this.state.phoneNumberValid && this.state.surnameValid
        });
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
                <div onClick={() => {
                    window.location.href = "/home";
                }}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
                </div>
                <h1 style={{ textAlign: 'center' }}>Add Doctor</h1>
                <div className='formErrors'>
                    <span style={{ fontSize: 10, padding: 10, color: 'red' }}>
                        {Object.keys(this.state.formErrors).map((fieldName, i) => {
                            if (this.state.formErrors[fieldName].length > 0) {
                                return (
                                    <p key={i}>{fieldName} {this.state.formErrors[fieldName]}</p>
                                )
                            } else {
                                return '';
                            }
                        })}
                    </span>
                </div>
                <span>first Name</span>
                <Input name='firstName' onChange={(event) => this.handleUserInput(event)} />
                <span>surname</span>
                <Input name='surname' onChange={(event) => this.handleUserInput(event)} />
                <span>ID Number</span>
                <Input name='idNumber' type={'number'} onChange={(event) => this.handleUserInput(event)} />
                <span>Phone Number</span>
                <Input name='phoneNumber' type='number' onChange={(event) => this.handleUserInput(event)} />
                <span>email</span>
                <Input name='email' onChange={(event) => this.handleUserInput(event)} />
                <span>Address</span>
                <Input name='hospitalAddress' onChange={(event) => this.handleUserInput(event)} />
                <span>Password</span>
                <div onClick={() => {
                    this.setState({ showPasswordDecription: !this.state.showPasswordDecription })
                }}>
                    <FontAwesomeIcon icon={this.state.showPasswordDecription ? faEyeSlash : faEye} />
                    {(this.state.showPasswordDecription) ? <a style={{ color: theme8bo.bgSpot, fontSize: 10 }}>
                        8 characters length,
                        2 letters in Upper Case,
                        1 Special Character (!@#$&*),
                        2 numerals (0-9),
                        3 letters in Lower Case,
                    </a> : null}
                </div>
                <Input name='password' onChange={(event) => this.handleUserInput(event)} />
                <span>Specialiazation</span>
                <Input name={'Specialiazation'} placeholder={'dentist,Psychiatrist,Dermatologist'} onChange={(e: any) => {
                    let sp = e.target.value.split(',');
                    this.setState({ personDetails: { ...this.state.personDetails, specialiazation: sp } })
                }} />
                <span>Picture</span>
                <Input type={'file'} onChange={(e: any) => {
                    this.getBase64(e).then((data) => {
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
                    Object.keys(this.state.formErrors).map((fieldName, i) => {
                        if (this.state.formErrors[fieldName].length <= 2) {
                            this.setState({ areRequiremetsMet: 'true' })
                        }
                    })
                    if (this.state.areRequiremetsMet == 'true') {
                        api.AddDoctor(this.state.personDetails, (success) => {
                            console.log(success);
                            this.setState({ status: success.status }, () => {
                                this.setState({ message: success.message })
                                if (this.state.status) {
                                    window.location.href = "/home";
                                }
                            })
                        }, err => { })
                    }

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
