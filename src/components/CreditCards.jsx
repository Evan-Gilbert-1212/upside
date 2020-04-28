import React, { useState, useEffect } from 'react'
import './CreditCards.scss'
import '../ConfirmDialog.scss'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import config from '../config'

const CreditCards = (props) => {
  const { displayMode } = props

  const [userCreditCards, setUserCreditCards] = useState({
    userCreditCardData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  const [deleteDialogInfo, setDeleteDialogInfo] = useState({
    isOpen: false,
    creditCardId: 0,
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    cardIssuerClass: 'card-issuer-edit',
  })

  let rowType = 'credit-card-row'

  if (displayMode === 'Modify') {
    rowType = 'credit-card-row-modify'
  }

  const getUserCreditCards = async () => {
    const response = await axios.get(`${config.API_URL}/api/creditcard`, {
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
        if (parseFloat(fieldValue) > 0) {
          return { ...prevModifiedRecord, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevModifiedRecord, [fieldName]: 0 }
        }
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

    setErrorResult({
      errorMessage: '',
      cardIssuerClass: 'card-issuer-edit',
    })
  }

  const updateCreditCard = (creditCardData) => {
    axios
      .put(`${config.API_URL}/api/creditcard`, creditCardData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const newCreditCardList = userCreditCards.userCreditCardData.filter(
            (card) => card.ID !== creditCardData.ID
          )

          creditCardData = { ...creditCardData, User: null }

          setUserCreditCards({
            userCreditCardData: [...newCreditCardList, creditCardData].sort(
              function (a, b) {
                if (a.CardIssuer < b.CardIssuer) {
                  return -1
                }
                if (a.CardIssuer > b.CardIssuer) {
                  return 1
                }
                return 0
              }
            ),
            isLoaded: true,
          })

          setModifiedRecord({})

          setErrorResult({
            errorMessage: '',
            cardIssuerClass: 'card-issuer-edit',
          })
        }
      })
      .catch((error) => {
        setErrorResult({
          errorMessage: error.response.data,
          cardIssuerClass: 'card-issuer-edit bad-input',
        })
      })
  }

  const deleteCreditCard = (creditCardId) => {
    axios.delete(`${config.API_URL}/api/creditcard/${creditCardId}`, {
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

    setDeleteDialogInfo({
      isOpen: false,
      creditCardId: 0,
    })
  }

  useEffect(() => {
    getUserCreditCards()
  }, [])

  return (
    <div className="credit-card-grid">
      <Dialog
        open={deleteDialogInfo.isOpen}
        onClose={() => {
          setDeleteDialogInfo({
            isOpen: false,
            creditCardId: 0,
          })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this credit card?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteCreditCard(deleteDialogInfo.creditCardId)
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setDeleteDialogInfo({
                isOpen: false,
                creditCardId: 0,
              })
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div className={rowType}>
        <span className="credit-card-column-1">Credit Card Issuer</span>
        <span className="credit-card-column-2">Account Balance</span>
        {displayMode === 'Modify' && (
          <>
            <span className="credit-card-column-3">Modify</span>
            <span className="credit-card-column-4">Delete</span>
          </>
        )}
      </div>
      <div className="credit-card-divider"></div>
      {!userCreditCards.isLoaded ? (
        <LoadingIcon />
      ) : userCreditCards.userCreditCardData.length > 0 ? (
        userCreditCards.userCreditCardData.map((card) => {
          return (
            <div key={card.ID} className={rowType}>
              {card.ID === modifiedRecord.ID ? (
                <>
                  <span className="credit-card-column-1">
                    <input
                      type="text"
                      name="CardIssuer"
                      className={errorResult.cardIssuerClass}
                      value={modifiedRecord.CardIssuer}
                      onChange={updateModifiedRecord}
                    />
                  </span>
                  <span className="credit-card-column-2">
                    <input
                      type="number"
                      name="AccountBalance"
                      className="card-balance-edit"
                      value={modifiedRecord.AccountBalance.toString()}
                      onChange={updateModifiedRecord}
                    />
                  </span>
                  <span
                    className="credit-card-column-3"
                    onClick={() => {
                      updateCreditCard(modifiedRecord)
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className="credit-card-column-4"
                    onClick={() => {
                      clearModifiedRecord()
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  {errorResult.errorMessage !== '' && (
                    <div className="modify-error-message">
                      <label>{errorResult.errorMessage}</label>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span className="credit-card-column-1">
                    {card.CardIssuer}
                  </span>
                  <span className="credit-card-column-2">
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
                        className="credit-card-column-3"
                        onClick={() => {
                          modifyCreditCard(card)
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className="credit-card-column-4">
                        <Button
                          className="action-icon"
                          onClick={() => {
                            setDeleteDialogInfo({
                              isOpen: true,
                              creditCardId: card.ID,
                            })
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
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
      <div className="credit-card-divider"></div>
      <div className={rowType}>
        <span className="credit-card-column-1">Total:</span>
        <span className="credit-card-column-2">
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
