import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'

const Expenses = () => {
  const [userExpenses, setUserExpenses] = useState({
    userExpenseData: [],
    isLoaded: false,
  })

  const getUserExpenses = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/expense/1'
    )
    setUserExpenses({
      userExpenseData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserExpenses()
  }, [])

  if (!userExpenses.isLoaded) {
    return <h2>Loading...</h2>
  } else {
    return (
      <div className="expense-section">
        <p className="expense-header">Upcoming Expenses</p>
        <div className="expense-row">
          <span className="expense-column-1">Category</span>
          <span className="expense-column-2">Description</span>
          <span className="expense-column-3">Due Date</span>
          <span className="expense-column-4">Amount</span>
        </div>
        <div className="account-divider"></div>
        {userExpenses.userExpenseData.map((expense) => {
          return (
            <div className="expense-row">
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
            </div>
          )
        })}
        <div className="account-divider"></div>
        <div className="expense-row">
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
}

export default Expenses
