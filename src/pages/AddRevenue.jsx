import React, { Component } from 'react'

class AddRevenue extends Component {
  render() {
    return (
      <section className="add-item">
        <h2>Add Revenue</h2>
        <label>Revenue Type</label>
        <select className="revenue-dropdown">
          <option value="Salary">Salary</option>
          <option value="IRS Tax Refund">IRS Tax Refund</option>
          <option value="Interest">Interest</option>
          <option value="Other">Other</option>
        </select>
        <label>Description</label>
        <input type="text" placeholder="Enter Description"></input>
        <label>Receipt Date</label>
        <input type="date" placeholder="Select Receipt Date"></input>
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
        <button>Add Revenue</button>
      </section>
    )
  }
}

export default AddRevenue
