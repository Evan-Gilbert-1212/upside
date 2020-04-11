import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const CreditCards = (props) => {
  const { displayMode } = props

  const [userCreditCards, setUserCreditCards] = useState({
    userCreditCardData: [],
    isLoaded: false,
  })

  let rowType = 'account-row'

  if (displayMode === 'Modify') {
    rowType = 'account-row-modify'
  }

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

  const modifyCreditCard = () => {
    //Modify the credit card
  }

  const deleteCreditCard = () => {
    //Delete the credit card
  }

  useEffect(() => {
    getUserCreditCards()
  }, [])

  return (
    <div className="credit-card-section">
      <div className={rowType}>
        <span className="account-column-1">Credit Cards</span>
        <span className="account-column-2">Account Balance</span>
        {displayMode === 'Modify' && (
          <>
            <span className="account-column-3">Modify</span>
            <span className="account-column-4">Delete</span>
          </>
        )}
      </div>
      <div className="account-divider"></div>
      {!userCreditCards.isLoaded ? (
        <LoadingIcon />
      ) : userCreditCards.userCreditCardData.length > 0 ? (
        userCreditCards.userCreditCardData.map((card) => {
          return (
            <div key={card.ID} className={rowType}>
              <span className="account-column-1">{card.CardIssuer}</span>
              <span className="account-column-2">
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
              {displayMode === 'Modify' && (
                <>
                  <span className="account-column-3" onClick={modifyCreditCard}>
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span className="account-column-4" onClick={deleteCreditCard}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </>
              )}
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No credit cards found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/credit-cards">Add a credit card now!</a>
          )}
        </div>
      )}
      <div className="account-divider"></div>
      <div className={rowType}>
        <span className="account-column-1">Total:</span>
        <span className="account-column-2">
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
