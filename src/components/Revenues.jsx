import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Revenues = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'
  // const API_URL = 'https://localhost:5001'

  const { displayMode, beginDate, endDate } = props

  const [userRevenues, setUserRevenues] = useState({
    userRevenueData: [],
    isLoaded: false,
  })

  let rowType = 'expense-row'

  if (displayMode === 'Modify') {
    rowType = 'expense-row-modify'
  }

  let response = {}

  const getUserRevenues = async () => {
    if (beginDate != null && endDate != null) {
      response = await axios.get(`${API_URL}/api/revenue`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          BeginDate: beginDate,
          EndDate: endDate,
        },
      })
    } else {
      response = await axios.get(`${API_URL}/api/revenue/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    }

    setUserRevenues({
      userRevenueData: response.data,
      isLoaded: true,
    })
  }

  const modifyRevenue = () => {
    //Modify the bank account
  }

  const deleteRevenue = (revenueId) => {
    const response = axios.delete(`${API_URL}/api/revenue/${revenueId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newRevenueList = userRevenues.userRevenueData.filter(
      (rev) => rev.ID !== revenueId
    )

    setUserRevenues({
      userRevenueData: newRevenueList,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserRevenues()
  }, [])

  return (
    <div className="revenue-section">
      <div className={rowType}>
        <span className="expense-column-1">Category</span>
        <span className="expense-column-2">Description</span>
        <span className="expense-column-3">Receipt Date</span>
        <span className="expense-column-4">Amount</span>
        {displayMode === 'Modify' && (
          <>
            <span className="expense-column-5">Modify</span>
            <span className="expense-column-6">Delete</span>
          </>
        )}
      </div>
      <div className="account-divider"></div>
      {!userRevenues.isLoaded ? (
        <LoadingIcon />
      ) : userRevenues.userRevenueData.length > 0 ? (
        userRevenues.userRevenueData.map((revenue) => {
          return (
            <div key={revenue.ID} className={rowType}>
              <span className="expense-column-1">
                {revenue.RevenueCategory}
              </span>
              <span className="expense-column-2">{revenue.RevenueName}</span>
              <span className="expense-column-3">
                <Moment format="MM/DD/YYYY">{revenue.RevenueDate}</Moment>
              </span>
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
              {displayMode === 'Modify' && (
                <>
                  <span className="expense-column-5" onClick={modifyRevenue}>
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span
                    className="expense-column-6"
                    onClick={() => {
                      deleteRevenue(revenue.ID)
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </>
              )}
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No Upcoming Revenues found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/revenues">Add a new revenue now!</a>
          )}
        </div>
      )}
      <div className="account-divider"></div>
      <div className={rowType}>
        <span className="expense-column-1">Total:</span>
        <span className="expense-column-4">
          {userRevenues.isLoaded && (
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
          )}
        </span>
      </div>
    </div>
  )
}

export default Revenues
