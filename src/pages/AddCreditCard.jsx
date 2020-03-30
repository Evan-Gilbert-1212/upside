import React, { Component } from 'react'

class AddCreditCard extends Component {
  render() {
    return (
      <section className="add-item">
        <h2>Add Credit Card</h2>
        <label>Credit Card Issuer</label>
        <input type="text" placeholder="Enter Credit Card Issuer"></input>
        <label>Opening Balance</label>
        <input type="text" placeholder="Enter Account Balance"></input>
        <button>Add Credit Card</button>
      </section>
    )
  }
}

export default AddCreditCard
