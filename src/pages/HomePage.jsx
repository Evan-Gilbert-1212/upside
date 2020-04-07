import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Accounts from '../components/Accounts'
import CreditCards from '../components/CreditCards'
import Expenses from '../components/Expenses'
import Revenues from '../components/Revenues'

const HomePage = () => {
  const [userSummary, setUserSummary] = useState({
    userSummaryData: {},
    isLoaded: false,
  })

  const getUserSummary = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/user/usersummary/1'
    )
    setUserSummary({
      userSummaryData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserSummary()
  }, [])

  if (!userSummary.isLoaded) {
    return <h2>Loading...</h2>
  } else {
    return (
      <main>
        <section className="welcome-banner">
          <h1>Good Afternoon, Evan!</h1>
          <h2>Your Account Summary:</h2>
        </section>
        <section className="account-summary">
          <section>
            <h2>CASH</h2>
            <NumberFormat
              value={userSummary.userSummaryData.AccountBalance}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'$'}
            />
          </section>
          <section>
            <h2>EXPENSE TOTAL</h2>
            <NumberFormat
              value={userSummary.userSummaryData.ExpenseTotal}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'$'}
            />
          </section>
          <section>
            <h2>REVENUE TOTAL</h2>
            <NumberFormat
              value={userSummary.userSummaryData.RevenueTotal}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'$'}
            />
          </section>
          <section>
            <h2>DISPOSABLE INCOME</h2>
            <NumberFormat
              value={
                userSummary.userSummaryData.RevenueTotal -
                userSummary.userSummaryData.ExpenseTotal
              }
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'$'}
            />
          </section>
        </section>
        <div className="summary-divider"></div>
        <section className="details-section">
          <Accounts />
          <CreditCards />
          <Expenses />
          <Revenues />
        </section>
      </main>
    )
  }
}

export default HomePage
