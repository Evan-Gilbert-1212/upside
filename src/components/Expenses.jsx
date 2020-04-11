import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Expenses = (props) => {
  const { displayMode, beginDate, endDate } = props

  const [userExpenses, setUserExpenses] = useState({
    userExpenseData: [],
    isLoaded: false,
  })

  let rowType = 'expense-row'

  if (displayMode === 'Modify') {
    rowType = 'expense-row-modify'
  }

  let response = {}

  const getUserExpenses = async () => {
    if (beginDate != null && endDate != null) {
      response = await axios.get(
        'https://upside-api.herokuapp.com/api/expense',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            BeginDate: beginDate,
            EndDate: endDate,
          },
        }
      )
    } else {
      response = await axios.get(
        'https://upside-api.herokuapp.com/api/expense/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
    }

    setUserExpenses({
      userExpenseData: response.data,
      isLoaded: true,
    })
  }

  const modifyExpense = () => {
    //Modify the bank account
  }

  const deleteExpense = () => {
    //Delete the bank account
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
              <span className="expense-column-1">
                {expense.ExpenseCategory}
              </span>
              <span className="expense-column-2">{expense.ExpenseName}</span>
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
                  <span className="expense-column-5" onClick={modifyExpense}>
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span className="expense-column-6" onClick={deleteExpense}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
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
        </span>
      </div>
    </div>
  )
}

export default Expenses
