import React, { useState } from 'react'
import './MaintainRevenues.scss'
import axios from 'axios'
import Revenues from '../components/Revenues'

const MaintainRevenues = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [revenueInfo, setRevenueInfo] = useState({
    RevenueCategory: 'Wages',
    RevenueName: '',
    RevenueDate: '',
    RevenueAmount: 0,
    RecurringFrequency: 'One Time',
  })

  const updateRevenueInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setRevenueInfo((prevRevenue) => {
      if (typeof prevRevenue[fieldName] === 'number') {
        return { ...prevRevenue, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevRevenue, [fieldName]: fieldValue }
      }
    })
  }

  const addRevenueToDb = async () => {
    const response = await axios.post(`${API_URL}/api/revenue`, revenueInfo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.status === 201) {
      //Any logic for successful Save
      window.location = '/revenues'
    }
  }

  return (
    <>
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
      </section>
      <section className="revenue-display">
        <h4>Your Revenues</h4>
        <Revenues displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainRevenues
