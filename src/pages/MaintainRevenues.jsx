import React, { useState, useEffect } from 'react'
import './MaintainRevenues.scss'
import axios from 'axios'
import Revenues from '../components/Revenues'
import RevenuesVertical from '../components/RevenuesVertical'
import config from '../config'

const MaintainRevenues = (props) => {
  const mode = props.mode

  let screenHeader = ''
  let screenCaption = ''
  let summaryCaption = ''
  let categoryClassName = ''
  let revenueGridMode = ''

  if (mode === 'Wages') {
    screenHeader = 'Wages'
    screenCaption = 'Add Wages'
    categoryClassName = 'revenue-category-disabled'
    summaryCaption = 'Your Wages'
    revenueGridMode = 'Wages'
  } else {
    screenHeader = 'Income'
    screenCaption = 'Add Income'
    categoryClassName = ''
    summaryCaption = 'Your Income'
    revenueGridMode = 'Modify'
  }

  const [revenueInfo, setRevenueInfo] = useState({
    RevenueCategory: 'Wages',
    RevenueName: '',
    RevenueDate: new Date(0),
    RevenueAmount: 0,
    RecurringFrequency: 'One Time',
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    revenueDateClass: '',
    revenueAmountClass: '',
  })

  const [setupItemClasses, setSetupItemClasses] = useState({
    setupMessageClass: 'setup-message',
    setupButtonClass: 'complete-setup-button-disabled',
  })

  const updateRevenueInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setRevenueInfo((prevRevenue) => {
      if (
        Object.prototype.toString.call(prevRevenue[fieldName]) ===
        '[object Date]'
      ) {
        if (fieldValue !== '') {
          const dateArr = fieldValue.split('-')

          return {
            ...prevRevenue,
            [fieldName]: new Date(dateArr[0], dateArr[1] - 1, dateArr[2]),
          }
        } else {
          return { ...prevRevenue, [fieldName]: new Date(0) }
        }
      } else if (typeof prevRevenue[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevRevenue, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevRevenue, [fieldName]: 0 }
        }
      } else {
        return { ...prevRevenue, [fieldName]: fieldValue }
      }
    })
  }

  const completeUserSetup = () => {
    window.location = '/'
  }

  const addRevenueToDb = async () => {
    await axios
      .post(`${config.API_URL}/api/revenue`, revenueInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          if (mode === 'Wages') {
            window.location = '/add-wages'
          } else {
            window.location = '/revenues'
          }
        }
      })
      .catch((error) => {
        if (error.response.data.includes('Receipt Date')) {
          setErrorResult({
            errorMessage: error.response.data,
            revenueDateClass: 'bad-input',
            revenueAmountClass: '',
          })
        } else if (error.response.data.includes('Amount')) {
          setErrorResult({
            errorMessage: error.response.data,
            revenueDateClass: '',
            revenueAmountClass: 'bad-input',
          })
        }
      })
  }

  useEffect(() => {
    if (mode === 'Wages') {
      const CheckForWagesRecords = async () => {
        const response = await axios.get(`${config.API_URL}/api/revenue/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const wagesRecords = response.data.filter(
          (item) => item.RevenueCategory === 'Wages'
        )

        if (wagesRecords.length > 0) {
          setSetupItemClasses({
            setupMessageClass: 'setup-message-hidden',
            setupButtonClass: 'complete-setup-button',
          })
        }
      }

      CheckForWagesRecords()
    }
  }, [mode])

  return (
    <section className="page-background">
      <div className="revenue-buffer"></div>
      <section className="revenue-entry-form">
        <h2>{screenHeader}</h2>
        <h4>{screenCaption}</h4>
        <section className="revenue-input-grid">
          <div>
            <label>Category</label>
            <select
              name="RevenueCategory"
              className={categoryClassName}
              onChange={updateRevenueInfo}
            >
              <option value="Wages">Wages</option>
              <option value="IRS Tax Refund">IRS Tax Refund</option>
              <option value="Interest">Interest</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              name="RevenueName"
              placeholder="Enter Description"
              onChange={updateRevenueInfo}
            ></input>
          </div>
          <div>
            <label>Receipt Date</label>
            <input
              type="date"
              name="RevenueDate"
              placeholder="Select Receipt Date"
              className={errorResult.revenueDateClass}
              onChange={updateRevenueInfo}
            ></input>
          </div>
          <div>
            <label>Amount</label>
            <input
              type="text"
              name="RevenueAmount"
              placeholder="Enter Amount"
              className={errorResult.revenueAmountClass}
              onChange={updateRevenueInfo}
            ></input>
          </div>
          <div>
            <label>Frequency *</label>
            <select name="RecurringFrequency" onChange={updateRevenueInfo}>
              {mode !== 'Wages' && <option value="One Time">One Time</option>}
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <button onClick={addRevenueToDb}>{screenCaption}</button>
        </section>
        <label className="recurring-trans-message">
          * Recurring transactions will be projected by the system six months in
          advance.
        </label>
        <label className="add-revenue-error-message">
          {errorResult.errorMessage}
        </label>
        {mode === 'Wages' && (
          <>
            <label className={setupItemClasses.setupMessageClass}>
              To complete setup, add at least 1 recurring "Wages" transaction.
            </label>
            <button
              className={setupItemClasses.setupButtonClass}
              onClick={completeUserSetup}
            >
              Complete Setup
            </button>
          </>
        )}
      </section>
      <section className="revenue-display">
        <h4>{summaryCaption}</h4>
        <Revenues displayMode={revenueGridMode} />
        <RevenuesVertical displayMode={revenueGridMode} />
      </section>
    </section>
  )
}

export default MaintainRevenues
