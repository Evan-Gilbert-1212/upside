import React, { useState } from 'react'
import './MaintainExpenses.scss'
import axios from 'axios'
import Expenses from '../components/Expenses'
import ExpensesVertical from '../components/ExpensesVertical'

const MaintainExpenses = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [expenseInfo, setExpenseInfo] = useState({
    ExpenseCategory: 'Cable & Internet',
    ExpenseName: '',
    ExpenseDate: new Date(0),
    ExpenseAmount: 0,
    RecurringFrequency: 'One Time',
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    expenseDateClass: '',
    expenseAmountClass: '',
  })

  const updateExpenseInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setExpenseInfo((prevExpense) => {
      if (
        Object.prototype.toString.call(prevExpense[fieldName]) ===
        '[object Date]'
      ) {
        if (fieldValue != '') {
          const dateArr = fieldValue.split('-')

          return {
            ...prevExpense,
            [fieldName]: new Date(dateArr[0], dateArr[1] - 1, dateArr[2]),
          }
        } else {
          return { ...prevExpense, [fieldName]: new Date(0) }
        }
      } else if (typeof prevExpense[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevExpense, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevExpense, [fieldName]: 0 }
        }
      } else {
        return { ...prevExpense, [fieldName]: fieldValue }
      }
    })
  }

  const addExpenseToDb = async () => {
    console.log(expenseInfo)

    const resp = await axios
      .post(`${API_URL}/api/expense`, expenseInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          window.location = '/expenses'
        }
      })
      .catch((error) => {
        if (error.response.data.includes('Due Date')) {
          setErrorResult({
            errorMessage: error.response.data,
            expenseDateClass: 'bad-input',
            expenseAmountClass: '',
          })
        } else if (error.response.data.includes('Amount')) {
          setErrorResult({
            errorMessage: error.response.data,
            expenseDateClass: '',
            expenseAmountClass: 'bad-input',
          })
        }
      })
  }

  return (
    <section className="page-background">
      <div className="expense-buffer"></div>
      <section className="expense-entry-form">
        <h2>Expenses</h2>
        <h4>Add Expense</h4>
        <section className="expense-input-grid">
          <div>
            <label>Expense Type</label>
            <select name="ExpenseCategory" onChange={updateExpenseInfo}>
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
          <div>
            <label>Description</label>
            <input
              type="text"
              name="ExpenseName"
              placeholder="Enter Description"
              onChange={updateExpenseInfo}
            ></input>
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              name="ExpenseDate"
              placeholder="Select Due Date"
              className={errorResult.expenseDateClass}
              onChange={updateExpenseInfo}
            ></input>
          </div>
          <div>
            <label>Amount</label>
            <input
              type="text"
              name="ExpenseAmount"
              placeholder="Enter Amount"
              className={errorResult.expenseAmountClass}
              onChange={updateExpenseInfo}
            ></input>
          </div>
          <div>
            <label>Recurring Frequency</label>
            <select name="RecurringFrequency" onChange={updateExpenseInfo}>
              <option value="One Time">One Time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <button onClick={addExpenseToDb}>Add Expense</button>
        </section>
        <label className="add-expense-error-message">
          {errorResult.errorMessage}
        </label>
      </section>
      <section className="expense-display">
        <h4>Your Expenses</h4>
        <Expenses displayMode="Modify" />
        <ExpensesVertical displayMode="Modify" />
      </section>
    </section>
  )
}

export default MaintainExpenses
