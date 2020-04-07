import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

const AddExpense = () => {
  const [expenseInfo, setExpenseInfo] = useState({
    ExpenseCategory: 'Cable & Internet',
    ExpenseName: '',
    ExpenseDate: '',
    ExpenseAmount: 0,
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const updateExpenseInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setExpenseInfo((prevExpense) => {
      if (typeof prevExpense[fieldName] === 'number') {
        prevExpense[fieldName] = parseFloat(fieldValue)
      } else {
        prevExpense[fieldName] = fieldValue
      }

      return prevExpense
    })
  }

  const addExpenseToDb = async () => {
    const response = await axios.post(
      'https://upside-api.herokuapp.com/api/expense/1',
      expenseInfo
    )

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/" />
  }

  return (
    <section className="add-item">
      <h2>Add Expense</h2>
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
        <option value="Utilities - Electricity">Utilities - Electricity</option>
        <option value="Rent">Rent</option>
        <option value="Other">Other</option>
      </select>
      <label>Description</label>
      <input
        type="text"
        name="ExpenseName"
        placeholder="Enter Description"
        onChange={updateExpenseInfo}
      ></input>
      <label>Due Date</label>
      <input
        type="date"
        name="ExpenseDate"
        placeholder="Select Due Date"
        onChange={updateExpenseInfo}
      ></input>
      <label>Item Amount</label>
      <input
        type="text"
        name="ExpenseAmount"
        placeholder="Enter Amount"
        onChange={updateExpenseInfo}
      ></input>
      <button onClick={addExpenseToDb}>Add Expense</button>
    </section>
  )
}

export default AddExpense
