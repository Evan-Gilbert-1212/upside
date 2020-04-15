import React, { useState, useEffect } from 'react'
import './RevenuesVertical.scss'
import '../ConfirmDialog.scss'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const Revenues = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const { displayMode, beginDate, endDate } = props

  const [userRevenues, setUserRevenues] = useState({
    userRevenueData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  const [deleteDialogInfo, setDeleteDialogInfo] = useState({
    isOpen: false,
    revenueId: 0,
  })

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

  const updateModifiedRecord = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setModifiedRecord((prevModifiedRecord) => {
      if (typeof prevModifiedRecord[fieldName] === 'number') {
        return { ...prevModifiedRecord, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevModifiedRecord, [fieldName]: fieldValue }
      }
    })
  }

  const modifyRevenue = (revenue) => {
    setModifiedRecord({
      ID: revenue.ID,
      RevenueCategory: revenue.RevenueCategory,
      RevenueName: revenue.RevenueName,
      RevenueDate: revenue.RevenueDate.substring(0, 10),
      RevenueAmount: parseFloat(revenue.RevenueAmount),
      UserID: revenue.UserID,
    })
  }

  const clearModifiedRecord = () => {
    setModifiedRecord({})
  }

  const updateRevenue = (revenueData) => {
    const response = axios.put(`${API_URL}/api/revenue`, revenueData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newRevenueList = userRevenues.userRevenueData.filter(
      (rev) => rev.ID !== revenueData.ID
    )

    revenueData = { ...revenueData, User: null }

    setUserRevenues({
      userRevenueData: [...newRevenueList, revenueData].sort(function (a, b) {
        if (a.RevenueDate < b.RevenueDate) {
          return -1
        }
        if (a.RevenueDate > b.RevenueDate) {
          return 1
        }
      }),
      isLoaded: true,
    })

    setModifiedRecord({})
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

    setDeleteDialogInfo({
      isOpen: false,
      revenueId: 0,
    })
  }

  useEffect(() => {
    getUserRevenues()
  }, [])

  return (
    <div className="revenue-grid">
      <Dialog
        open={deleteDialogInfo.isOpen}
        onClose={() => {
          setDeleteDialogInfo({
            isOpen: false,
            revenueId: 0,
          })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this revenue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteRevenue(deleteDialogInfo.revenueId)
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setDeleteDialogInfo({
                isOpen: false,
                revenueId: 0,
              })
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div className="revenue-divider"></div>
      {!userRevenues.isLoaded ? (
        <LoadingIcon />
      ) : userRevenues.userRevenueData.length > 0 ? (
        userRevenues.userRevenueData.map((revenue) => {
          return (
            <div key={revenue.ID} className="vertical-display">
              {revenue.ID === modifiedRecord.ID ? (
                <>
                  <div className="data-row">
                    <span>Category</span>
                    <select
                      name="RevenueCategory"
                      className="revenue-category-edit"
                      value={modifiedRecord.RevenueCategory}
                      onChange={updateModifiedRecord}
                    >
                      <option value="Wages">Wages</option>
                      <option value="IRS Tax Refund">IRS Tax Refund</option>
                      <option value="Interest">Interest</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="data-row">
                    <span>Description</span>
                    <input
                      type="text"
                      name="RevenueName"
                      className="revenue-name-edit"
                      value={modifiedRecord.RevenueName}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Receipt Date</span>
                    <input
                      type="date"
                      name="RevenueDate"
                      className="revenue-date-edit"
                      value={modifiedRecord.RevenueDate}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Amount</span>
                    <input
                      type="text"
                      name="RevenueAmount"
                      className="revenue-amount-edit"
                      value={modifiedRecord.RevenueAmount}
                      onChange={updateModifiedRecord}
                    ></input>
                  </div>
                  <div className="data-row">
                    <span>Update</span>
                    <span
                      className="revenue-column-5"
                      onClick={() => {
                        updateRevenue(modifiedRecord)
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Cancel</span>
                    <span
                      className="revenue-column-6"
                      onClick={() => {
                        clearModifiedRecord()
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="data-row">
                    <span>Category</span>
                    <span className="revenue-column-1">
                      {revenue.RevenueCategory}
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Description</span>
                    <span className="revenue-column-2">
                      {revenue.RevenueName}
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Receipt Date</span>
                    <span className="revenue-column-3">
                      <Moment format="MM/DD/YYYY">{revenue.RevenueDate}</Moment>
                    </span>
                  </div>
                  <div className="data-row">
                    <span>Amount</span>
                    <span className="revenue-column-4">
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
                  {displayMode === 'Modify' && (
                    <>
                      <div className="data-row">
                        <span>Modify</span>
                        <span
                          className="revenue-column-5"
                          onClick={() => {
                            modifyRevenue(revenue)
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                      </div>
                      <div className="data-row">
                        <span>Delete</span>
                        <span className="revenue-column-6">
                          <Button
                            className="action-icon"
                            onClick={() => {
                              setDeleteDialogInfo({
                                isOpen: true,
                                revenueId: revenue.ID,
                              })
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </span>
                      </div>
                    </>
                  )}
                  <div className="revenue-divider"></div>
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
      <div className="total-row">
        <span>Total:</span>
        <span>
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
