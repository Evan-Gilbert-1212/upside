import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import logo from './images/logo.png'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import HomePage from './pages/HomePage'
import AddBankAccount from './pages/AddBankAccount'
import AddCreditCard from './pages/AddCreditCard'
import AddExpense from './pages/AddExpense'
import AddRevenue from './pages/AddRevenue'
import { slide as Menu } from 'react-burger-menu'

const App = () => {
  const logout = () => {
    localStorage.removeItem('token')

    window.location = '/login'
  }

  if (localStorage.getItem('token')) {
    return (
      <>
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
          <a id="logout" className="menu-item" href="/login" onClick={logout}>
            Log Out
          </a>
        </Menu>
        <header>
          <a className="website-logo" href="/">
            <img src={logo} alt="Website Logo" />
            <span>Upside</span>
          </a>
        </header>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/login" component={LogIn}></Route>
            <Route exact path="/add-account" component={AddBankAccount}></Route>
            <Route
              exact
              path="/add-credit-card"
              component={AddCreditCard}
            ></Route>
            <Route exact path="/add-expense" component={AddExpense}></Route>
            <Route exact path="/add-revenue" component={AddRevenue}></Route>
          </Switch>
        </Router>
      </>
    )
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/signup" component={SignUp}></Route>
        <Route exact path="*" component={LogIn}></Route>
      </Switch>
    </Router>
  )
}

export default App
