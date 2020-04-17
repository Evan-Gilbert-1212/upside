import React, { useState } from 'react'
import './MaintainRevenues.scss'
import axios from 'axios'
import Revenues from '../components/Revenues'
import RevenuesVertical from '../components/RevenuesVertical'

const MaintainRevenues = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

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

  const updateRevenueInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setRevenueInfo((prevRevenue) => {
      if (
        Object.prototype.toString.call(prevRevenue[fieldName]) ===
        '[object Date]'
      ) {
        if (fieldValue != '') {
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

  const addRevenueToDb = async () => {
    const resp = await axios
      .post(`${API_URL}/api/revenue`, revenueInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          window.location = '/revenues'
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

  return (
    <section className="page-background">
      <div className="revenue-buffer"></div>
      <section className="revenue-entry-form">
        <h2>Revenues</h2>
        <h4>Add Revenue</h4>
        <section className="revenue-input-grid">
          <div>
            <label>Revenue Type</label>
            <select name="RevenueCategory" onChange={updateRevenueInfo}>
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
            <label>Recurring Frequency</label>
            <select name="RecurringFrequency" onChange={updateRevenueInfo}>
              <option value="One Time">One Time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <button onClick={addRevenueToDb}>Add Revenue</button>
        </section>
        <label className="add-revenue-error-message">
          {errorResult.errorMessage}
        </label>
      </section>
      <section className="revenue-display">
        <h4>Your Revenues</h4>
        <Revenues displayMode="Modify" />
        <RevenuesVertical displayMode="Modify" />
      </section>
    </section>
  )
}

export default MaintainRevenues
