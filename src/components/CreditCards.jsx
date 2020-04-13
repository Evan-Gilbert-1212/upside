import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const CreditCards = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const { displayMode } = props

  const [userCreditCards, setUserCreditCards] = useState({
    userCreditCardData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  let rowType = 'account-row'

  if (displayMode === 'Modify') {
    rowType = 'account-row-modify'
  }

  const getUserCreditCards = async () => {
    const response = await axios.get(`${API_URL}/api/creditcard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    setUserCreditCards({
      userCreditCardData: response.data,
      isLoaded: true,
    })
  }

  const updateModifiedRecord = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setModifiedRecord((prevModifiedRecord) => {
      if (typeof prevModifiedRecord[fieldName] === 'number') {
        return { ...prevModifiedRecord, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevModifiedRecord, [fieldName]: fieldValue }
      }
    })
  }

  const modifyCreditCard = (creditCard) => {
    setModifiedRecord({
      ID: creditCard.ID,
      CardIssuer: creditCard.CardIssuer,
      AccountBalance: parseFloat(creditCard.AccountBalance),
      UserID: creditCard.UserID,
    })
  }

  const clearModifiedRecord = () => {
    setModifiedRecord({})
  }

  const updateCreditCard = (creditCardData) => {
    const response = axios.put(`${API_URL}/api/creditcard`, creditCardData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newCreditCardList = userCreditCards.userCreditCardData.filter(
      (card) => card.ID !== creditCardData.ID
    )

    creditCardData = { ...creditCardData, User: null }

    setUserCreditCards({
      userCreditCardData: [...newCreditCardList, creditCardData].sort(function (
        a,
        b
      ) {
        if (a.CardIssuer < b.CardIssuer) {
          return -1
        }
        if (a.CardIssuer > b.CardIssuer) {
          return 1
        }
      }),
      isLoaded: true,
    })

    setModifiedRecord({})
  }

  const deleteCreditCard = (creditCardId) => {
    const response = axios.delete(`${API_URL}/api/creditcard/${creditCardId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newCreditCardList = userCreditCards.userCreditCardData.filter(
      (card) => card.ID !== creditCardId
    )

    setUserCreditCards({
      userCreditCardData: newCreditCardList,
      isLoaded: true,
    })
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
              {card.ID === modifiedRecord.ID ? (
                <>
                  <span className="account-column-1">
                    <input
                      type="text"
                      name="CardIssuer"
                      className="edit-input-text"
                      value={modifiedRecord.CardIssuer}
                      onChange={updateModifiedRecord}
                    />
                  </span>
                  <span className="account-column-2">
                    <input
                      type="text"
                      name="AccountBalance"
                      className="edit-input-number"
                      value={modifiedRecord.AccountBalance}
                      onChange={updateModifiedRecord}
                    />
                  </span>
                  <span
                    className="account-column-3"
                    onClick={() => {
                      updateCreditCard(modifiedRecord)
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className="account-column-4"
                    onClick={() => {
                      clearModifiedRecord()
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </>
              ) : (
                <>
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
                      <span
                        className="account-column-3"
                        onClick={() => {
                          modifyCreditCard(card)
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span
                        className="account-column-4"
                        onClick={() => {
                          deleteCreditCard(card.ID)
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                    </>
                  )}
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
          {userCreditCards.isLoaded && (
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
          )}
        </span>
      </div>
    </div>
  )
}

export default CreditCards
