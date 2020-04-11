import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Revenues from '../components/Revenues'

const MaintainRevenues = () => {
  const [revenueInfo, setRevenueInfo] = useState({
    RevenueCategory: 'Wages',
    RevenueName: '',
    RevenueDate: '',
    RevenueAmount: 0,
    RecurringFrequency: 'One Time',
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const updateRevenueInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setRevenueInfo((prevRevenue) => {
      if (typeof prevRevenue[fieldName] === 'number') {
        prevRevenue[fieldName] = parseFloat(fieldValue)
      } else {
        prevRevenue[fieldName] = fieldValue
      }

      return prevRevenue
    })
  }

  const addRevenueToDb = async () => {
    const response = await axios.post(
      'https://upside-api.herokuapp.com/api/revenue',
      revenueInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/" />
  }

  return (
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Revenues</h2>
        <h4>Add Revenue</h4>
        <section className="input-grid">
          <div>
            <label>Revenue Type</label>
            <select
              className="revenue-dropdown"
              name="RevenueCategory"
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
              onChange={updateRevenueInfo}
            ></input>
          </div>
          <div>
            <label>Item Amount</label>
            <input
              type="text"
              name="RevenueAmount"
              placeholder="Enter Amount"
              onChange={updateRevenueInfo}
            ></input>
          </div>
          <div>
            <label>Recurring Frequency</label>
            <select
              className="recurring-dropdown"
              name="RecurringFrequency"
              onChange={updateRevenueInfo}
            >
              <option value="One Time">One Time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <button onClick={addRevenueToDb}>Add Revenue</button>
        </section>
      </section>
      <section className="data-display-wide">
        <h4>Your Revenues</h4>
        <Revenues displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainRevenues