import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './SiteHeader.scss'
import logo from './images/logo.png'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import HomePage from './pages/HomePage'
import MaintainBankAccounts from './pages/MaintainBankAccounts'
import MaintainCreditCards from './pages/MaintainCreditCards'
import MaintainExpenses from './pages/MaintainExpenses'
import MaintainRevenues from './pages/MaintainRevenues'
import MaintainRecurringTransactions from './pages/MaintainRecurringTransactions'
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUniversity } from '@fortawesome/free-solid-svg-icons'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import NewUserSetup from './pages/NewUserSetup'

const App = () => {
  const logout = () => {
    localStorage.removeItem('token')

    window.location = '/login'
  }

  if (localStorage.getItem('temp-token')) {
    return (
      <Router>
        <Switch>
          <Route exact path="/new-user-setup" component={NewUserSetup}></Route>
          <Route
            exact
            path="/add-wages"
            render={() => <MaintainRevenues mode="Wages" />}
          ></Route>
          <Route exact path="*" component={LogIn}></Route>
        </Switch>
      </Router>
    )
  } else if (localStorage.getItem('token')) {
    return (
      <>
        <Menu right>
          <a id="home" className="menu-item" href="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </a>
          <a id="bank-accounts" className="menu-item" href="/bank-accounts">
            <FontAwesomeIcon icon={faUniversity} /> Bank Accounts
          </a>
          <a id="credit-cards" className="menu-item" href="/credit-cards">
            <FontAwesomeIcon icon={faCreditCard} /> Credit Cards
          </a>
          <a id="expenses" className="menu-item" href="/expenses">
            <FontAwesomeIcon icon={faHandHoldingUsd} /> Expenses
          </a>
          <a id="revenues" className="menu-item" href="/revenues">
            <FontAwesomeIcon icon={faMoneyBillWave} /> Revenues
          </a>
          <a
            id="recurring-transactions"
            className="menu-item"
            href="/recurring-transactions"
          >
            <FontAwesomeIcon icon={faRedoAlt} /> Recurring Transactions
          </a>
          <a id="logout" className="menu-item" href="/login" onClick={logout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
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
            <Route
              exact
              path="/bank-accounts"
              component={MaintainBankAccounts}
            ></Route>
            <Route
              exact
              path="/credit-cards"
              component={MaintainCreditCards}
            ></Route>
            <Route exact path="/expenses" component={MaintainExpenses}></Route>
            <Route exact path="/revenues" component={MaintainRevenues}></Route>
            <Route
              exact
              path="/recurring-transactions"
              component={MaintainRecurringTransactions}
            ></Route>
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
