import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'

const Revenues = () => {
  const [userRevenues, setUserRevenues] = useState({
    userRevenueData: [],
    isLoaded: false,
  })

  const getUserRevenues = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/revenue/1'
    )
    setUserRevenues({
      userRevenueData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserRevenues()
  }, [])

  if (!userRevenues.isLoaded) {
    return <h2>Loading...</h2>
  } else {
    return (
      <div className="revenue-section">
        <p className="expense-header">Upcoming Revenues</p>
        <div className="expense-row">
          <span className="expense-column-1">Category</span>
          <span className="expense-column-2">Description</span>
          <span className="expense-column-3">Receipt Date</span>
          <span className="expense-column-4">Amount</span>
        </div>
        <div className="account-divider"></div>
        {userRevenues.userRevenueData.map((revenue) => {
          return (
            <div className="expense-row">
              <span className="expense-column-1">
                {revenue.RevenueCategory}
              </span>
              <span className="expense-column-2">{revenue.RevenueName}</span>
              <span className="expense-column-3">{revenue.RevenueDate}</span>
              <span className="expense-column-4">
                {' '}
                <NumberFormat
                  value={revenue.RevenueAmount}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix={'$'}
                />
              </span>
            </div>
          )
        })}
        <div className="account-divider"></div>
        <div className="expense-row">
          <span className="expense-column-1">Total:</span>
          <span className="expense-column-4">
            <NumberFormat
              value={userRevenues.userRevenueData.reduce(
                (sum, revenue) => sum + revenue.RevenueAmount,
                0
              )}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={'$'}
            />
          </span>
        </div>
      </div>
    )
  }
}

export default Revenues
