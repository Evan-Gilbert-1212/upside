import React, { useState, useEffect } from 'react'
import './RecurringTransactions.scss'
import '../ConfirmDialog.scss'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
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

const RecurringTransactions = (props) => {
  const { displayMode } = props

  const [userRecurringTransactions, setUserRecurringTransactions] = useState({
    userRecurringTransactionData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  const [deleteDialogInfo, setDeleteDialogInfo] = useState({
    isOpen: false,
    recurringTransId: 0,
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    transactionDateClass: 'first-payment-date-edit',
    transactionAmountClass: 'transaction-amount-edit',
  })

  let rowType = 'recurring-trans-row'

  if (displayMode === 'Modify') {
    rowType = 'recurring-trans-row-modify'
  }

  const getUsersRecurringTransactions = async () => {
    const response = await axios.get(
      `${config.API_URL}/api/recurringtransaction`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    setUserRecurringTransactions({
      userRecurringTransactionData: response.data,
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

  const modifyRecurringTransaction = (recurringTransaction) => {
    setModifiedRecord({
      ID: recurringTransaction.ID,
      TransactionType: recurringTransaction.TransactionType,
      TransactionCategory: recurringTransaction.TransactionCategory,
      TransactionName: recurringTransaction.TransactionName,
      FirstPaymentDate: recurringTransaction.FirstPaymentDate.substring(0, 10),
      TransactionAmount: parseFloat(recurringTransaction.TransactionAmount),
      RecurringFrequency: recurringTransaction.RecurringFrequency,
      UserID: recurringTransaction.UserID,
    })
  }

  const clearModifiedRecord = () => {
    setModifiedRecord({})

    setErrorResult({
      errorMessage: '',
      transactionDateClass: 'first-payment-date-edit',
      transactionAmountClass: 'transaction-amount-edit',
    })
  }

  const updateRecurringTransaction = (recurringTransactionData) => {
    if (recurringTransactionData.FirstPaymentDate === '') {
      setErrorResult({
        errorMessage: 'Begin Date cannot be blank.',
        transactionDateClass: 'first-payment-date-edit bad-input',
        transactionAmountClass: 'transaction-amount-edit',
      })
    } else {
      axios
        .put(
          `${config.API_URL}/api/recurringtransaction`,
          recurringTransactionData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            const newRecurringTransactionList = userRecurringTransactions.userRecurringTransactionData.filter(
              (trans) => trans.ID !== recurringTransactionData.ID
            )

            recurringTransactionData = {
              ...recurringTransactionData,
              User: null,
            }

            setUserRecurringTransactions({
              userRecurringTransactionData: [
                ...newRecurringTransactionList,
                recurringTransactionData,
              ].sort(function (a, b) {
                if (a.FirstPaymentDate < b.FirstPaymentDate) {
                  return -1
                }
                if (a.FirstPaymentDate > b.FirstPaymentDate) {
                  return 1
                }
                return 0
              }),
              isLoaded: true,
            })

            setModifiedRecord({})

            setErrorResult({
              errorMessage: '',
              transactionDateClass: 'first-payment-date-edit',
              transactionAmountClass: 'transaction-amount-edit',
            })
          }
        })
        .catch((error) => {
          if (error.response.data.includes('Amount')) {
            setErrorResult({
              errorMessage: error.response.data,
              transactionDateClass: 'first-payment-date-edit',
              transactionAmountClass: 'transaction-amount-edit bad-input',
            })
          }
        })
    }
  }

  const deleteRecurringTransaction = (recurringTransId) => {
    axios.delete(
      `${config.API_URL}/api/recurringtransaction/${recurringTransId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    const newRecurringTransactionList = userRecurringTransactions.userRecurringTransactionData.filter(
      (trans) => trans.ID !== recurringTransId
    )

    setUserRecurringTransactions({
      userRecurringTransactionData: newRecurringTransactionList,
      isLoaded: true,
    })

    setDeleteDialogInfo({
      isOpen: false,
      recurringTransId: 0,
    })
  }

  useEffect(() => {
    getUsersRecurringTransactions()
  }, [])

  return (
    <div className="recurring-trans-grid">
      <Dialog
        open={deleteDialogInfo.isOpen}
        onClose={() => {
          setDeleteDialogInfo({
            isOpen: false,
            recurringTransId: 0,
          })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this recurring transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteRecurringTransaction(deleteDialogInfo.recurringTransId)
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
                recurringTransId: 0,
              })
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div className={rowType}>
        <span className="recurring-trans-column-1">Type</span>
        <span className="recurring-trans-column-2">Category</span>
        <span className="recurring-trans-column-3">Description</span>
        <span className="recurring-trans-column-4">Begin Date</span>
        <span className="recurring-trans-column-5">Amount</span>
        <span className="recurring-trans-column-6">Frequency</span>
        {displayMode === 'Modify' && (
          <>
            <span className="recurring-trans-column-7">Modify</span>
            <span className="recurring-trans-column-8">Delete</span>
          </>
        )}
      </div>
      <div className="recurring-trans-divider"></div>

      {!userRecurringTransactions.isLoaded ? (
        <LoadingIcon />
      ) : userRecurringTransactions.userRecurringTransactionData.length > 0 ? (
        userRecurringTransactions.userRecurringTransactionData.map(
          (transaction) => {
            return (
              <div key={transaction.ID} className={rowType}>
                {transaction.ID === modifiedRecord.ID ? (
                  <>
                    <span className="recurring-trans-column-1">
                      {modifiedRecord.TransactionType}
                    </span>
                    <span className="recurring-trans-column-2">
                      <select
                        name="TransactionCategory"
                        className="transaction-category-edit"
                        value={modifiedRecord.TransactionCategory}
                        onChange={updateModifiedRecord}
                      >
                        {modifiedRecord.TransactionType === 'Revenue' ? (
                          <>
                            <option value="Wages">Wages</option>
                            <option value="IRS Tax Refund">
                              IRS Tax Refund
                            </option>
                            <option value="Interest">Interest</option>
                            <option value="Other">Other</option>
                          </>
                        ) : (
                          <>
                            <option value="Cable & Internet">
                              Cable & Internet
                            </option>
                            <option value="Car - Gas">Car - Gas</option>
                            <option value="Car - Insurance">
                              Car - Insurance
                            </option>
                            <option value="Cell Phone">Cell Phone</option>
                            <option value="Education">Education</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Food">Food</option>
                            <option value="Health Insurance">
                              Health Insurance
                            </option>
                            <option value="Utilities - Gas">
                              Utilities - Gas
                            </option>
                            <option value="Utilities - Electricity">
                              Utilities - Electricity
                            </option>
                            <option value="Rent">Rent</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                    </span>
                    <span className="recurring-trans-column-3">
                      <input
                        type="text"
                        name="TransactionName"
                        className="transaction-name-edit"
                        value={modifiedRecord.TransactionName}
                        onChange={updateModifiedRecord}
                      ></input>
                    </span>
                    <span className="recurring-trans-column-4">
                      <input
                        type="date"
                        name="FirstPaymentDate"
                        className={errorResult.transactionDateClass}
                        value={modifiedRecord.FirstPaymentDate}
                        onChange={updateModifiedRecord}
                      ></input>
                    </span>
                    <span className="recurring-trans-column-5">
                      <input
                        type="number"
                        name="TransactionAmount"
                        className={errorResult.transactionAmountClass}
                        value={modifiedRecord.TransactionAmount.toString()}
                        onChange={updateModifiedRecord}
                      ></input>
                    </span>
                    <span className="recurring-trans-column-6">
                      <select
                        name="RecurringFrequency"
                        className="recurring-frequency-edit"
                        value={modifiedRecord.RecurringFrequency}
                        onChange={updateModifiedRecord}
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Annually">Annually</option>
                      </select>
                    </span>
                    <span
                      className="recurring-trans-column-7"
                      onClick={() => {
                        updateRecurringTransaction(modifiedRecord)
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span
                      className="recurring-trans-column-8"
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
                    <span className="recurring-trans-column-1">
                      {transaction.TransactionType}
                    </span>
                    <span className="recurring-trans-column-2">
                      {transaction.TransactionCategory}
                    </span>
                    <span className="recurring-trans-column-3">
                      {transaction.TransactionName}
                    </span>
                    <span className="recurring-trans-column-4">
                      <Moment format="MM/DD/YYYY">
                        {transaction.FirstPaymentDate}
                      </Moment>
                    </span>
                    <span className="recurring-trans-column-5">
                      {' '}
                      <NumberFormat
                        value={transaction.TransactionAmount}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={'$'}
                      />
                    </span>
                    <span className="recurring-trans-column-6">
                      {transaction.RecurringFrequency}
                    </span>
                    {displayMode === 'Modify' && (
                      <>
                        <span
                          className="recurring-trans-column-7"
                          onClick={() => {
                            modifyRecurringTransaction(transaction)
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                        <span className="recurring-trans-column-8">
                          <Button
                            className="action-icon"
                            onClick={() => {
                              setDeleteDialogInfo({
                                isOpen: true,
                                recurringTransId: transaction.ID,
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
          }
        )
      ) : (
        <div className="no-records-found">No Recurring Transactions found.</div>
      )}
      <div className="recurring-trans-divider"></div>
      <div className={rowType}>
        <span className="recurring-trans-column-1">Total:</span>
        <span className="recurring-trans-column-5">
          {userRecurringTransactions.isLoaded && (
            <NumberFormat
              value={userRecurringTransactions.userRecurringTransactionData.reduce(
                (sum, transaction) => sum + transaction.TransactionAmount,
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

export default RecurringTransactions
