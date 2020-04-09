import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const AddCreditCard = () => {
  const [cardInfo, setCardInfo] = useState({
    CardIssuer: '',
    AccountBalance: 0,
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)

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
    const response = await axios.post(
      'https://upside-api.herokuapp.com/api/creditcard',
      cardInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/home" />
  }

  return (
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Add Credit Card</h2>
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
        </section>
        <button onClick={addCreditCardToDb}>Add Credit Card</button>
      </section>
    </>
  )
}

export default AddCreditCard
