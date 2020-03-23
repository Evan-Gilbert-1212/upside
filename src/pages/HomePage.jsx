import React, { Component } from 'react'
import logo from '../images/logo.png'

class HomePage extends Component {
  render() {
    return (
      <main>
        <section className="summary-section">
          <h1>Good Afternoon, Evan!</h1>
          <h2>ALL ACCOUNTS</h2>
          <p className="summary-balance">$XXX.XXX.XX</p>
        </section>
      </main>
    )
  }
}

export default HomePage
