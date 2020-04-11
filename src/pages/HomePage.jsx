import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Accounts from '../components/Accounts'
import CreditCards from '../components/CreditCards'
import Expenses from '../components/Expenses'
import Revenues from '../components/Revenues'
import Moment from 'react-moment'
import LoadingIcon from '../components/LoadingIcon'

const HomePage = () => {
  const [pageData, setPageData] = useState({
    userSummaryData: {},
    isLoaded: false,
  })

  const loadPageData = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/user/usersummary',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    setPageData({
      userSummaryData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    loadPageData()
  }, [])

  if (!pageData.isLoaded) {
    return (
      <>
        <div className="buffer"></div>
        <LoadingIcon />
      </>
    )
  } else {
    return (
      <main>
        <section className="welcome-banner">
          <h1>Good Afternoon, {pageData.userSummaryData.FirstName}!</h1>
          <h2>Account Summary</h2>
          <h4>
            for the period{' '}
            <Moment format="MM/DD/YYYY">
              {pageData.userSummaryData.PeriodBeginDate}
            </Moment>{' '}
            to{' '}
            <Moment format="MM/DD/YYYY">
              {pageData.userSummaryData.PeriodEndDate}
            </Moment>
          </h4>
        </section>
        <section className="account-summary">
          <section>
            <h2>CASH</h2>
            <label>
              <NumberFormat
                value={pageData.userSummaryData.AccountBalance}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </label>
          </section>
          <section>
            <h2>EXPENSES</h2>
            <label>
              <NumberFormat
                value={pageData.userSummaryData.ExpenseTotal}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </label>
          </section>
          <section>
            <h2>REVENUES</h2>
            <label>
              <NumberFormat
                value={pageData.userSummaryData.RevenueTotal}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </label>
          </section>
          <section>
            <h2>DISPOSABLE INCOME</h2>
            <label>
              <NumberFormat
                value={
                  pageData.userSummaryData.RevenueTotal -
                  pageData.userSummaryData.ExpenseTotal
                }
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </label>
          </section>
        </section>
        <div className="summary-divider"></div>
        <section className="details-section">
          <section className="account-section">
            <Accounts />
            <CreditCards />
          </section>
          <div className="vertical-divider"></div>
          <section className="transaction-section">
            <div>
              <p className="expense-header">Expenses This Period</p>
              <Expenses
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
            </div>
            <div>
              <p className="expense-header">Revenues This Period</p>
              <Revenues
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
            </div>
          </section>
        </section>
      </main>
    )
  }
}

export default HomePage
