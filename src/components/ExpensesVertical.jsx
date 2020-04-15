import React, { useState, useEffect } from 'react'
import './ExpensesVertical.scss'
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

const ExpensesVertical = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const { displayMode, beginDate, endDate } = props

  const [userExpenses, setUserExpenses] = useState({
    userExpenseData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  const [deleteDialogInfo, setDeleteDialogInfo] = useState({
    isOpen: false,
    expenseId: 0,
  })

  let response = {}

  const getUserExpenses = async () => {
    if (beginDate != null && endDate != null) {
      response = await axios.get(`${API_URL}/api/expense`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          BeginDate: beginDate,
          EndDate: endDate,
        },
      })
    } else {
      response = await axios.get(`${API_URL}/api/expense/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    }

    setUserExpenses({
      userExpenseData: response.data,
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

  const modifyExpense = (expense) => {
    setModifiedRecord({
      ID: expense.ID,
      ExpenseCategory: expense.ExpenseCategory,
      ExpenseName: expense.ExpenseName,
      ExpenseDate: expense.ExpenseDate.substring(0, 10),
      ExpenseAmount: parseFloat(expense.ExpenseAmount),
      UserID: expense.UserID,
    })
  }

  const clearModifiedRecord = () => {
    setModifiedRecord({})
  }

  const updateExpense = (expenseData) => {
    const response = axios.put(`${API_URL}/api/expense`, expenseData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newExpenseList = userExpenses.userExpenseData.filter(
      (exp) => exp.ID !== expenseData.ID
    )

    expenseData = { ...expenseData, User: null }

    setUserExpenses({
      userExpenseData: [...newExpenseList, expenseData].sort(function (a, b) {
        if (a.ExpenseDate < b.ExpenseDate) {
          return -1
        }
        if (a.ExpenseDate > b.ExpenseDate) {
          return 1
        }
      }),
      isLoaded: true,
    })

    setModifiedRecord({})
  }

  const deleteExpense = (expenseId) => {
    const response = axios.delete(`${API_URL}/api/expense/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newExpenseList = userExpenses.userExpenseData.filter(
      (exp) => exp.ID !== expenseId
    )

    setUserExpenses({
      userExpenseData: newExpenseList,
      isLoaded: true,
    })

    setDeleteDialogInfo({
      isOpen: false,
      expenseId: 0,
    })
  }

  useEffect(() => {
    getUserExpenses()
  }, [])

  return (
    <div className="expense-grid">
      <Dialog
        open={deleteDialogInfo.isOpen}
        onClose={() => {
          setDeleteDialogInfo({
            isOpen: false,
            expenseId: 0,
          })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this expense?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteExpense(deleteDialogInfo.expenseId)
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
                expenseId: 0,
              })
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div className="expense-divider"></div>
      {!userExpenses.isLoaded ? (
        <LoadingIcon />
      ) : userExpenses.userExpenseData.length > 0 ? (
        userExpenses.userExpenseData.map((expense) => {
          return (
            <div key={expense.ID} className="vertical-display">
              {expense.ID === modifiedRecord.ID ? (
                <>
                  <div className="data-row">
                    <span>Category</span>
                    <select
                      name="ExpenseCategory"
                      className="expense-category-edit"
                      value={modifiedRecord.ExpenseCategory}
                      onChange={updateModifiedRecord}
                    >
                      <option value="Cable & Internet">Cable & Internet</option>
                      <option value="Car - Gas">Car - Gas</option>
                      <option value="Car - Insurance">Car - Insurance</option>
                      <option value="Cell Phone">Cell Phone</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Food">Food</option>
                      <option value="Health Insurance">Health Insurance</option>
                      <option value="Utilities - Gas">Utilities - Gas</option>
                      <option value="Utilities - Electricity">
                        Utilities - Electricity
                      </option>
                      <option value="Rent">Rent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="data-row">
                    <span>Description</span>
                    <input
                      type="text"
                      name="ExpenseName"
                      className="expense-name-edit"
                      value={modifiedRecord.ExpenseName}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Due Date</span>
                    <input
                      type="date"
                      name="ExpenseDate"
                      className="expense-date-edit"
                      value={modifiedRecord.ExpenseDate}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Amount</span>
                    <input
                      type="text"
                      name="ExpenseAmount"
                      className="expense-amount-edit"
                      value={modifiedRecord.ExpenseAmount}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Update</span>
                    <span
                      className="expense-column-5"
                      onClick={() => {
                        updateExpense(modifiedRecord)
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Cancel</span>
                    <span
                      className="expense-column-6"
                      onClick={() => {
                        clearModifiedRecord()
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="data-row">
                    <span>Category</span>
                    <span>{expense.ExpenseCategory}</span>
                  </div>
                  <div className="data-row">
                    <span>Description</span>
                    <span>{expense.ExpenseName}</span>
                  </div>
                  <div className="data-row">
                    <span>Due Date</span>
                    <span>
                      <Moment format="MM/DD/YYYY">{expense.ExpenseDate}</Moment>
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Amount</span>
                    <span>
                      {' '}
                      <NumberFormat
                        value={expense.ExpenseAmount}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={'$'}
                      />
                    </span>
                  </div>
                  {displayMode === 'Modify' && (
                    <>
                      <div className="data-row">
                        <span>Modify</span>
                        <span
                          onClick={() => {
                            modifyExpense(expense)
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                      </div>
                      <div className="data-row">
                        <span>Delete</span>
                        <span className="expense-column-6">
                          <Button
                            className="action-icon"
                            onClick={() => {
                              setDeleteDialogInfo({
                                isOpen: true,
                                expenseId: expense.ID,
                              })
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </span>
                      </div>
                    </>
                  )}
                  <div className="expense-divider"></div>
                </>
              )}
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No Upcoming Expenses found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/expenses">Add a new expense now!</a>
          )}
        </div>
      )}
      <div className="total-row">
        <span>Total:</span>
        <span>
          {userExpenses.isLoaded && (
            <NumberFormat
              value={userExpenses.userExpenseData.reduce(
                (sum, expense) => sum + expense.ExpenseAmount,
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

export default ExpensesVertical