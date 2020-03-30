import React, { Component } from 'react'

class AddExpense extends Component {
  render() {
    return (
      <section className="add-item">
        <h2>Add Expense</h2>
        <label>Expense Type</label>
        <select className="expense-dropdown">
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
        <label>Description</label>
        <input type="text" placeholder="Enter Description"></input>
        <label>Due Date</label>
        <input type="date" placeholder="Select Due Date"></input>
        <label>Item Amount</label>
        <input type="text" placeholder="Enter Amount"></input>
        <label>Recurring?</label>
        <div>
          <input
            className="radio-button"
            type="radio"
            id="yes-button"
            name="recurring-radio"
            value="true"
          ></input>
          <label for="yes-button">Yes</label>
          <input
            className="radio-button"
            type="radio"
            id="no-button"
            name="recurring-radio"
            value="false"
          ></input>
          <label for="no-button">No</label>
        </div>
        <label>Recurring Frequency</label>
        <select className="recurring-dropdown">
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annually">Annually</option>
        </select>
        <button>Add Expense</button>
      </section>
    )
  }
}

export default AddExpense
