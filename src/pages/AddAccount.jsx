import React, { Component } from 'react'

class AddAccount extends Component {
  render() {
    return (
      <section className="add-item">
        <h2>Add Account</h2>
        <label>Account Type</label>
        <select className="account-dropdown">
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
        <label>Opening Balance</label>
        <input type="text" placeholder="Enter Account Balance"></input>
        <button>Add Account</button>
      </section>
    )
  }
}

export default AddAccount
