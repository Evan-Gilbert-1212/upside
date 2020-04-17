import React, { useState, useEffect } from 'react'
import './RecurringTransactionsVertical.scss'
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

const RecurringTransactionsVertical = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

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

  const getUsersRecurringTransactions = async () => {
    const response = await axios.get(`${API_URL}/api/recurringtransaction`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

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
        return { ...prevModifiedRecord, [fieldName]: parseFloat(fieldValue) }
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
  }

  const updateRecurringTransaction = (recurringTransactionData) => {
    const response = axios.put(
      `${API_URL}/api/recurringtransaction`,
      recurringTransactionData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    const newRecurringTransactionList = userRecurringTransactions.userRecurringTransactionData.filter(
      (trans) => trans.ID !== recurringTransactionData.ID
    )

    recurringTransactionData = { ...recurringTransactionData, User: null }

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
      }),
      isLoaded: true,
    })

    setModifiedRecord({})
  }

  const deleteRecurringTransaction = (recurringTransId) => {
    const response = axios.delete(
      `${API_URL}/api/recurringtransaction/${recurringTransId}`,
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
    <div className="recurring-trans-grid-vertical">
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
      <div className="recurring-trans-divider"></div>
      {!userRecurringTransactions.isLoaded ? (
        <LoadingIcon />
      ) : userRecurringTransactions.userRecurringTransactionData.length > 0 ? (
        userRecurringTransactions.userRecurringTransactionData.map(
          (transaction) => {
            return (
              <div key={transaction.ID} className="vertical-display">
                {transaction.ID === modifiedRecord.ID ? (
                  <>
                    <div className="data-row">
                      <span>Transaction Type</span>
                      <span>
                        <select
                          name="TransactionType"
                          className="transaction-type-edit-vertical"
                          value={modifiedRecord.TransactionType}
                          onChange={updateModifiedRecord}
                        >
                          <option value="Expense">Expense</option>
                          <option value="Revenue">Revenue</option>
                        </select>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Category</span>
                      <span>
                        <select
                          name="TransactionCategory"
                          className="transaction-category-edit-vertical"
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
                              <option value="Entertainment">
                                Entertainment
                              </option>
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
                    </div>
                    <div className="data-row">
                      <span>Description</span>
                      <span>
                        <input
                          type="text"
                          name="TransactionName"
                          className="transaction-name-edit-vertical"
                          value={modifiedRecord.TransactionName}
                          onChange={updateModifiedRecord}
                        ></input>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>First Payment Date</span>
                      <span>
                        <input
                          type="date"
                          name="FirstPaymentDate"
                          className="first-payment-date-edit-vertical"
                          value={modifiedRecord.FirstPaymentDate}
                          onChange={updateModifiedRecord}
                        ></input>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Amount</span>
                      <span>
                        <input
                          type="text"
                          name="TransactionAmount"
                          className="transaction-amount-edit-vertical"
                          value={modifiedRecord.TransactionAmount}
                          onChange={updateModifiedRecord}
                        ></input>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Frequency</span>
                      <span>
                        <select
                          name="RecurringFrequency"
                          className="recurring-frequency-edit-vertical"
                          value={modifiedRecord.RecurringFrequency}
                          onChange={updateModifiedRecord}
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-Weekly">Bi-Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Annually">Annually</option>
                        </select>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Update</span>
                      <span
                        className="action-icon"
                        onClick={() => {
                          updateRecurringTransaction(modifiedRecord)
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Cancel</span>
                      <span
                        className="action-icon"
                        onClick={() => {
                          clearModifiedRecord()
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </div>
                    <div className="recurring-trans-divider"></div>
                  </>
                ) : (
                  <>
                    <div className="data-row">
                      <span>Transaction Type</span>
                      <span>{transaction.TransactionType}</span>
                    </div>
                    <div className="data-row">
                      <span>Category</span>
                      <span>{transaction.TransactionCategory}</span>
                    </div>
                    <div className="data-row">
                      <span>Description</span>
                      <span>{transaction.TransactionName}</span>
                    </div>
                    <div className="data-row">
                      <span>First Payment Date</span>
                      <span>
                        <Moment format="MM/DD/YYYY">
                          {transaction.FirstPaymentDate}
                        </Moment>
                      </span>
                    </div>
                    <div className="data-row">
                      <span>Amount</span>
                      <span>
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
                    </div>
                    <div className="data-row">
                      <span>Frequency</span>
                      <span>{transaction.RecurringFrequency}</span>
                    </div>
                    {displayMode === 'Modify' && (
                      <>
                        <div className="data-row">
                          <span>Modify</span>
                          <span
                            className="action-icon"
                            onClick={() => {
                              modifyRecurringTransaction(transaction)
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </span>
                        </div>
                        <div className="data-row">
                          <span>Delete</span>
                          <span className="action-icon">
                            <Button
                              className="dialog-action-icon"
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
                        </div>
                      </>
                    )}
                    <div className="recurring-trans-divider"></div>
                  </>
                )}
              </div>
            )
          }
        )
      ) : (
        <>
          <div className="no-records-found">
            No Recurring Transactions found.
          </div>
          <div className="recurring-trans-divider"></div>
        </>
      )}
      <div className="total-row">
        <span>Total:</span>
        <span>
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

export default RecurringTransactionsVertical
