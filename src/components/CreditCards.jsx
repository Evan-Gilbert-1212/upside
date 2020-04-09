import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'

const CreditCards = () => {
  const [userCreditCards, setUserCreditCards] = useState({
    userCreditCardData: [],
    isLoaded: false,
  })

  const getUserCreditCards = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/creditcard',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    setUserCreditCards({
      userCreditCardData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserCreditCards()
  }, [])

  return (
    <div className="credit-card-section">
      <div className="account-row">
        <span>Credit Cards</span>
        <span>Account Balance</span>
      </div>
      <div className="account-divider"></div>
      {!userCreditCards.isLoaded ? (
        <LoadingIcon />
      ) : userCreditCards.userCreditCardData.length > 0 ? (
        userCreditCards.userCreditCardData.map((card) => {
          return (
            <div key={card.ID} className="account-row">
              <span>{card.CardIssuer}</span>
              <span>
                {' '}
                <NumberFormat
                  value={card.AccountBalance}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix={'$'}
                />
              </span>
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No credit cards found.{' '}
          <a href="/add-credit-card">Add a credit card now!</a>
        </div>
      )}
      <div className="account-divider"></div>
      <div className="account-row">
        <span>Total:</span>
        <span>
          <NumberFormat
            value={userCreditCards.userCreditCardData.reduce(
              (sum, card) => sum + card.AccountBalance,
              0
            )}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={'$'}
          />
        </span>
      </div>
    </div>
  )
}

export default CreditCards
