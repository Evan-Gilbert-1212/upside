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
    periodBeginDate: '',
    periodEndDate: '',
    isLoaded: false,
  })

  const loadPageData = async () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const currentDay = currentDate.getDate()

    let periodBeginDay = 0
    let periodEndDay = 0

    if (currentDay >= 1 && currentDay <= 15) {
      periodBeginDay = 1
      periodEndDay = 15
    } else {
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

      periodBeginDay = 16
      periodEndDay = lastDayOfMonth.getDate()
    }

    const BeginDate = currentYear + '-' + currentMonth + '-' + periodBeginDay
    const EndDate = currentYear + '-' + currentMonth + '-' + periodEndDay

    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/user/usersummary',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          BeginDate: BeginDate,
          EndDate: EndDate,
        },
      }
    )

    setPageData({
      userSummaryData: response.data,
      periodBeginDate: BeginDate,
      periodEndDate: EndDate,
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
            <Moment format="MM/DD/YYYY">{pageData.periodBeginDate}</Moment> to{' '}
            <Moment format="MM/DD/YYYY">{pageData.periodEndDate}</Moment>
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
            <Expenses
              beginDate={pageData.periodBeginDate}
              endDate={pageData.periodEndDate}
            />
            <Revenues
              beginDate={pageData.periodBeginDate}
              endDate={pageData.periodEndDate}
            />
          </section>
        </section>
      </main>
    )
  }
}

export default HomePage
