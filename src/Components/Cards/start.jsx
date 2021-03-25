import React from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import Card from './Card'
import { api } from "../../api/api";
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate
} from './cardUtils'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
    await sleep(300)
    // window.alert(JSON.stringify(values, 0, 2))
}

export const StartCards = (data) => {
    console.log('in pay ', data.appId);
    return (
        <Styles>
            <Form
                onSubmit={onSubmit}
                render={({
                    handleSubmit,
                    form,
                    submitting,
                    pristine,
                    values,
                    active
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Card
                                number={values.number || ''}
                                name={values.name || ''}
                                expiry={values.expiry || ''}
                                cvc={values.cvc || ''}
                                focused={active}
                            />
                            <div>
                                <Field
                                    name="number"
                                    component="input"
                                    type="text"
                                    pattern="[\d| ]{16,22}"
                                    placeholder="Card Number"
                                    format={formatCreditCardNumber}
                                />
                            </div>
                            <div>
                                <Field
                                    name="name"
                                    component="input"
                                    type="text"
                                    placeholder="Name"
                                />
                            </div>
                            <div>
                                <Field
                                    name="expiry"
                                    component="input"
                                    type="text"
                                    pattern="\d\d/\d\d"
                                    placeholder="Valid Thru"
                                    format={formatExpirationDate}
                                />
                                <Field
                                    name="cvc"
                                    component="input"
                                    type="text"
                                    pattern="\d{3,4}"
                                    placeholder="CVC"
                                    format={formatCVC}
                                />
                            </div>
                            <div className="buttons">
                                <button onClick={() => {
                                    api.getMyAppointment(data.appId).then((res) => {
                                        console.log(res.message)
                                        if (res.status) {
                                            api.UpdatePayments(data.appId, res.data.payments.totalCost, 'paid').then((res) => {
                                                if (res.status) {
                                                    alert(res.message)
                                                } else {
                                                    alert(`Failed while making payments ${res.message}`)
                                                }
                                            })
                                        } else {
                                            alert(`Failed while trying to get message ${res.message}`)
                                        }
                                    })
                                }} type="submit" disabled={submitting}>
                                    Submit
              </button>
                                <button
                                    type="button"
                                    onClick={form.reset}
                                    disabled={submitting || pristine}
                                >
                                    Reset
              </button>
                            </div>

                        </form>
                    )
                }}
            />
        </Styles >
    );

};
