import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import CreditCards from '../components/CreditCards'

const MaintainCreditCards = () => {
  const API_URL = 'https://upside-api.herokuapp.com'
  // const API_URL = 'https://localhost:5001'

  const [cardInfo, setCardInfo] = useState({
    CardIssuer: '',
    AccountBalance: 0,
  })

  const updateCardInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setCardInfo((prevCardInfo) => {
      if (typeof prevCardInfo[fieldName] === 'number') {
        prevCardInfo[fieldName] = parseFloat(fieldValue)
      } else {
        prevCardInfo[fieldName] = fieldValue
      }

      return prevCardInfo
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
    }
  }

  return (
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Credit Cards</h2>
        <h4>Add Credit Card</h4>
        <section className="input-grid">
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
      <section className="data-display">
        <h4>Your Credit Cards</h4>
        <CreditCards displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainCreditCards
