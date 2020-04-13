import React, { useState } from 'react'
import axios from 'axios'
import Expenses from '../components/Expenses'

const MaintainExpenses = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [expenseInfo, setExpenseInfo] = useState({
    ExpenseCategory: 'Cable & Internet',
    ExpenseName: '',
    ExpenseDate: '',
    ExpenseAmount: 0,
    RecurringFrequency: 'One Time',
  })

  const updateExpenseInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setExpenseInfo((prevExpense) => {
      if (typeof prevExpense[fieldName] === 'number') {
        return { ...prevExpense, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevExpense, [fieldName]: fieldValue }
      }
    })
  }

  const addExpenseToDb = async () => {
    const response = await axios.post(`${API_URL}/api/expense`, expenseInfo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.status === 201) {
      //Any logic for successful Save
      window.location = '/expenses'
    }
  }

  return (
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Expenses</h2>
        <h4>Add Expense</h4>
        <section className="input-grid">
          <div>
            <label>Expense Type</label>
            <select
              name="ExpenseCategory"
              className="expense-dropdown"
              onChange={updateExpenseInfo}
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
              onChange={updateExpenseInfo}
            ></input>
          </div>
          <div>
            <label>Item Amount</label>
            <input
              type="text"
              name="ExpenseAmount"
              placeholder="Enter Amount"
              onChange={updateExpenseInfo}
            ></input>
          </div>
          <div>
            <label>Recurring Frequency</label>
            <select
              className="recurring-dropdown"
              name="RecurringFrequency"
              onChange={updateExpenseInfo}
            >
              <option value="One Time">One Time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <button onClick={addExpenseToDb}>Add Expense</button>
        </section>
      </section>
      <section className="data-display-wide">
        <h4>Your Expenses</h4>
        <Expenses displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainExpenses
