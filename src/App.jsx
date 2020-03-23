import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import logo from './images/logo.png'
import HomePage from './pages/HomePage'
import AddAccount from './pages/AddAccount'
import AddCreditCard from './pages/AddCreditCard'
import AddExpense from './pages/AddExpense'
import AddRevenue from './pages/AddRevenue'

class App extends Component {
  render() {
    return (
      <Router>
        <header>
          <img className="header-logo" src={logo} alt="Website Logo" />
          <span className="website-name">Upside</span>
          <div class="dropdown-menu">
            <button class="menu-button">MENU</button>
            <div class="dropdown-content">
              <Link to="/">Home</Link>
              <Link to="/add-account">Add Account</Link>
              <Link to="/add-credit-card">Add Credit Card</Link>
              <Link to="/add-expense">Add Expense</Link>
              <Link to="/add-revenue">Add Revenue</Link>
            </div>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={HomePage}></Route>
          <Route exact path="/add-account" component={AddAccount}></Route>
          <Route
            exact
            path="/add-credit-card"
            component={AddCreditCard}
          ></Route>
          <Route exact path="/add-expense" component={AddExpense}></Route>
          <Route exact path="/add-revenue" component={AddRevenue}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App
