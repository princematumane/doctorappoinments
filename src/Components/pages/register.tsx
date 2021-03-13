import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { api } from '../../api/api';
import { Patient } from '../../api/model/Interface';
import { ValidateIdNumber, ValidateSouthAfricanPhonenumber, validEmailAddress } from '../../helpers';
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
    height:100%;
    position: absolute;
    min-height: 150%;
    z-index: 99;
`;

export const Panel = styled.div`
    margin-top: 50px;
    background: ${({ theme }) => theme.gradient};
    max-width: 50%;
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
    message: string,
    addressValid: boolean,
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
    areRequiremetsMet: boolean
}


export class Register extends React.Component {

    tempPersonDetails: Patient = {
        address: "",
        email: "",
        firstName: '',
        gender: '',
        idNumber: 0,
        password: '',
        phoneNumber: '',
        picture: "",
        surname: '',
    }
    genderOptions: DropdownInterface[] = [{ value: '', option: 'Choose gender' }, { value: 'male', option: 'Male' }, { value: 'female', option: 'Female' }];
    state: State = {
        personDetails: this.tempPersonDetails,
        status: false,
        message: '',
        addressValid: false,
        emailValid: false,
        genderValid: false,
        firstNameValid: false,
        idNumberValid: false,
        passwordValid: false,
        surnameValid: false,
        phoneNumberValid: false,
        pictureValid: false,
        confirmPasswordValid: false,
        areRequiremetsMet: false,
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
        }
    }


    componentDidMount() {

    }
    handleUserInput(e: any) {
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
        let addressValid = this.state.addressValid;
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
                passwordValid = value.length >= 5;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            case 'confirmPassword':
                confirmPasswordValid = value.length >= 5 && this.state.personDetails.password == value;
                fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' is too short or does not match';
                break;
            case 'address':
                addressValid = value.length >= 5;
                fieldValidationErrors.address = addressValid ? '' : ' is too short';
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
            addressValid: addressValid,
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
                && this.state.passwordValid && this.state.addressValid && this.state.firstNameValid &&
                this.state.idNumberValid && this.state.phoneNumberValid && this.state.surnameValid
        });
    }
    logginPanel() {
        return (
            <div>
                <div onClick={() => {
                    window.location.href = "/login";
                }}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
                </div>
                <h1 style={{ textAlign: 'center' }}>Create your file</h1>

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
                <Input name='address' onChange={(event) => this.handleUserInput(event)} />
                <span>Password</span>
                <Input name='password' onChange={(event) => this.handleUserInput(event)} />

                <span>confirm Password</span>
                <Input name='confirmPassword' onChange={(event) => this.handleUserInput(event)} />

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
                {(!this.state.areRequiremetsMet) ?
                    <p style={{ fontSize: 10, color: theme8bo.brandSpot }}>Submit button will appear if/after all the requirements of the form are met !!</p> :

                    <Button disabled={!this.state.areRequiremetsMet} style={{ width: '102%' }} text='Create File' onClick={() => {
                        Object.keys(this.state.formErrors).map((fieldName, i) => {
                            if (this.state.formErrors[fieldName].length > 0) {
                                this.setState({ status: false }, () => {
                                    this.setState({ message: this.state.formErrors[fieldName] + " Requirements are not fully met" })
                                })
                                this.setState({ areRequiremetsMet: false })
                            }
                        })
                        if (this.state.areRequiremetsMet) {
                            api.AddPatient(this.state.personDetails, (success) => {
                                console.log(success);
                                this.setState({ status: success.status }, () => {
                                    this.setState({ message: success.message })
                                    if (this.state.status) {
                                        window.location.href = "/login";
                                    }
                                })

                            }, err => { })
                        }


                    }} />}

            </div>
        );
    }

    render() {
        return (
            <MainContainer>
                <Panel>
                    {this.logginPanel()}
                </Panel>
            </MainContainer>
        )
    }
}
