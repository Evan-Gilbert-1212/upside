import React, { useState } from 'react'
import './MaintainCreditCards.scss'
import axios from 'axios'
import CreditCards from '../components/CreditCards'
import config from '../config'

const MaintainCreditCards = () => {
  const [cardInfo, setCardInfo] = useState({
    CardIssuer: '',
    AccountBalance: 0,
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    cardIssuerClass: '',
  })

  const updateCardInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setCardInfo((prevCardInfo) => {
      if (typeof prevCardInfo[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevCardInfo, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevCardInfo, [fieldName]: 0 }
        }
      } else {
        return { ...prevCardInfo, [fieldName]: fieldValue }
      }
    })
  }

  const addCreditCardToDb = async () => {
    const resp = await axios
      .post(`${config.API_URL}/api/creditcard`, cardInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          window.location = '/credit-cards'
        }
      })
      .catch((error) => {
        setErrorResult({
          errorMessage: error.response.data,
          cardIssuerClass: 'bad-input',
        })
      })
  }

  return (
    <section className="page-background">
      <div className="credit-card-buffer"></div>
      <section className="credit-card-entry-form">
        <h2>Credit Cards</h2>
        <h4>Add Credit Card</h4>
        <section className="credit-card-input-grid">
          <div>
            <label>Credit Card Issuer</label>
            <input
              type="text"
              name="CardIssuer"
              placeholder="Enter Credit Card Issuer"
              className={errorResult.cardIssuerClass}
              onChange={updateCardInfo}
            ></input>
          </div>
          <div>
            <label>Opening Balance</label>
            <input
              type="text"
              name="AccountBalance"
              placeholder="Enter Account Balance"
              onChange={updateCardInfo}
            ></input>
          </div>
          <button onClick={addCreditCardToDb}>Add Credit Card</button>
        </section>
        <label className="add-card-error-message">
          {errorResult.errorMessage}
        </label>
      </section>
      <section className="credit-card-data-display">
        <h4>Your Credit Cards</h4>
        <CreditCards displayMode="Modify" />
      </section>
    </section>
  )
}

export default MaintainCreditCards
