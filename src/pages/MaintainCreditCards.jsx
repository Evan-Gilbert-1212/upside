import React, { useState } from 'react'
import './MaintainCreditCards.scss'
import axios from 'axios'
import CreditCards from '../components/CreditCards'

const MaintainCreditCards = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [cardInfo, setCardInfo] = useState({
    CardIssuer: '',
    AccountBalance: 0,
  })

  const updateCardInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setCardInfo((prevCardInfo) => {
      if (typeof prevCardInfo[fieldName] === 'number') {
        return { ...prevCardInfo, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevCardInfo, [fieldName]: fieldValue }
      }
    })
  }

  const addCreditCardToDb = async () => {
    const response = await axios.post(`${API_URL}/api/creditcard`, cardInfo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.status === 201) {
      //Any logic for successful Save
      window.location = '/credit-cards'
    }
  }

  return (
    <>
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
      </section>
      <section className="credit-card-data-display">
        <h4>Your Credit Cards</h4>
        <CreditCards displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainCreditCards
