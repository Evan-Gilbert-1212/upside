import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import logo from './images/logo.png'
import HomePage from './pages/HomePage'
import AddAccount from './pages/AddAccount'
import AddCreditCard from './pages/AddCreditCard'
import AddExpense from './pages/AddExpense'
import AddRevenue from './pages/AddRevenue'
import { slide as Menu } from 'react-burger-menu'

class App extends Component {
  render() {
    return (
      <Router>
        <Menu right>
          <a id="home" className="menu-item" href="/">
            Home
          </a>
          <a id="add-account" className="menu-item" href="/add-account">
            Add Account
          </a>
          <a id="add-credit-card" className="menu-item" href="/add-credit-card">
            Add Credit Card
          </a>
          <a id="add-expense" className="menu-item" href="/add-expense">
            Add Expense
          </a>
          <a id="add-revenue" className="menu-item" href="/add-revenue">
            Add Revenue
          </a>
        </Menu>
        <header>
          <img className="header-logo" src={logo} alt="Website Logo" />
          <span className="website-name">Upside</span>
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
