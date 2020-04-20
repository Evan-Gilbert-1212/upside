import React, { useState, useEffect } from 'react'
import './HomePage.scss'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Accounts from '../components/Accounts'
import CreditCards from '../components/CreditCards'
import Expenses from '../components/Expenses'
import ExpensesVertical from '../components/ExpensesVertical'
import Revenues from '../components/Revenues'
import RevenuesVertical from '../components/RevenuesVertical'
import Moment from 'react-moment'
import LoadingIcon from '../components/LoadingIcon'

const HomePage = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [pageData, setPageData] = useState({
    userSummaryData: {},
    isLoaded: false,
  })

  const loadPageData = async () => {
    const response = await axios.get(`${API_URL}/api/user/usersummary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log(response.data)

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
      <section className="page-background">
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
          <div className="detail-divider"></div>
          <section className="transaction-section">
            <div className="expense-section">
              <p className="expense-header">Expenses This Period</p>
              <Expenses
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
              <ExpensesVertical
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
            </div>
            <div className="revenue-section">
              <p className="expense-header">Revenues This Period</p>
              <Revenues
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
              <RevenuesVertical
                displayMode="View"
                beginDate={pageData.userSummaryData.PeriodBeginDate}
                endDate={pageData.userSummaryData.PeriodEndDate}
              />
            </div>
          </section>
        </section>
      </section>
    )
  }
}

export default HomePage
