import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Expenses = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const { displayMode, beginDate, endDate } = props

  const [userExpenses, setUserExpenses] = useState({
    userExpenseData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  let rowType = 'expense-row'

  if (displayMode === 'Modify') {
    rowType = 'expense-row-modify'
  }

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
  }

  useEffect(() => {
    getUserExpenses()
  }, [])

  return (
    <div className="expense-section">
      <div className={rowType}>
        <span className="expense-column-1">Category</span>
        <span className="expense-column-2">Description</span>
        <span className="expense-column-3">Due Date</span>
        <span className="expense-column-4">Amount</span>
        {displayMode === 'Modify' && (
          <>
            <span className="expense-column-5">Modify</span>
            <span className="expense-column-6">Delete</span>
          </>
        )}
      </div>
      <div className="account-divider"></div>
      {!userExpenses.isLoaded ? (
        <LoadingIcon />
      ) : userExpenses.userExpenseData.length > 0 ? (
        userExpenses.userExpenseData.map((expense) => {
          return (
            <div key={expense.ID} className={rowType}>
              {expense.ID === modifiedRecord.ID ? (
                <>
                  <span className="expense-column-1">
                    <select
                      name="ExpenseCategory"
                      className="edit-select"
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
                  </span>
                  <span className="expense-column-2">
                    <input
                      type="text"
                      name="ExpenseName"
                      className="edit-input-text"
                      value={modifiedRecord.ExpenseName}
                      onChange={updateModifiedRecord}
                    ></input>
                  </span>
                  <span className="expense-column-3">
                    <input
                      type="date"
                      name="ExpenseDate"
                      className="edit-date"
                      value={modifiedRecord.ExpenseDate}
                      onChange={updateModifiedRecord}
                    ></input>
                  </span>
                  <span className="expense-column-4">
                    <input
                      type="text"
                      name="ExpenseAmount"
                      className="edit-input-number"
                      value={modifiedRecord.ExpenseAmount}
                      onChange={updateModifiedRecord}
                    ></input>
                  </span>
                  <span
                    className="expense-column-5"
                    onClick={() => {
                      updateExpense(modifiedRecord)
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className="expense-column-6"
                    onClick={() => {
                      clearModifiedRecord()
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </>
              ) : (
                <>
                  <span className="expense-column-1">
                    {expense.ExpenseCategory}
                  </span>
                  <span className="expense-column-2">
                    {expense.ExpenseName}
                  </span>
                  <span className="expense-column-3">
                    <Moment format="MM/DD/YYYY">{expense.ExpenseDate}</Moment>
                  </span>
                  <span className="expense-column-4">
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
                  {displayMode === 'Modify' && (
                    <>
                      <span
                        className="expense-column-5"
                        onClick={() => {
                          modifyExpense(expense)
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span
                        className="expense-column-6"
                        onClick={() => {
                          deleteExpense(expense.ID)
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
          No Upcoming Expenses found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/expenses">Add a new expense now!</a>
          )}
        </div>
      )}
      <div className="account-divider"></div>
      <div className={rowType}>
        <span className="expense-column-1">Total:</span>
        <span className="expense-column-4">
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

export default Expenses
