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
      'https://upside-api.herokuapp.com/api/creditcard/1',
      cardInfo
    )

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/" />
  }

  return (
    <section className="add-item">
      <h2>Add Credit Card</h2>
      <label>Credit Card Issuer</label>
      <input
        type="text"
        name="CardIssuer"
        placeholder="Enter Credit Card Issuer"
        onChange={updateCardInfo}
      ></input>
      <label>Opening Balance</label>
      <input
        type="text"
        name="AccountBalance"
        placeholder="Enter Account Balance"
        onChange={updateCardInfo}
      ></input>
      <button onClick={addCreditCardToDb}>Add Credit Card</button>
    </section>
  )
}

export default AddCreditCard
