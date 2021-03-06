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
import config from '../config'

const Revenues = (props) => {
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

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    revenueDateClass: 'revenue-date-edit-vertical',
    revenueAmountClass: 'revenue-amount-edit-vertical',
  })

  const [filters, setFilters] = useState({
    FilterCategory: '',
    FilterReceiptDate: '',
    FilterAmount: 0,
  })

  const updateModifiedRecord = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setModifiedRecord((prevModifiedRecord) => {
      if (typeof prevModifiedRecord[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevModifiedRecord, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevModifiedRecord, [fieldName]: 0 }
        }
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

    setErrorResult({
      errorMessage: '',
      revenueDateClass: 'revenue-date-edit-vertical',
      revenueAmountClass: 'revenue-amount-edit-vertical',
    })
  }

  const updateRevenue = (revenueData) => {
    if (revenueData.RevenueDate === '') {
      setErrorResult({
        errorMessage: 'Receipt Date cannot be blank.',
        revenueDateClass: 'revenue-date-edit bad-input',
        revenueAmountClass: 'revenue-amount-edit',
      })
    } else {
      axios
        .put(`${config.API_URL}/api/revenue`, revenueData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const newRevenueList = userRevenues.userRevenueData.filter(
              (rev) => rev.ID !== revenueData.ID
            )

            revenueData = { ...revenueData, User: null }

            setUserRevenues({
              userRevenueData: [...newRevenueList, revenueData].sort(function (
                a,
                b
              ) {
                if (a.RevenueDate < b.RevenueDate) {
                  return -1
                }
                if (a.RevenueDate > b.RevenueDate) {
                  return 1
                }
                return 0
              }),
              isLoaded: true,
            })

            setModifiedRecord({})

            setErrorResult({
              errorMessage: '',
              revenueDateClass: 'revenue-date-edit-vertical',
              revenueAmountClass: 'revenue-amount-edit-vertical',
            })
          }
        })
        .catch((error) => {
          if (error.response.data.includes('Amount')) {
            setErrorResult({
              errorMessage: error.response.data,
              revenueDateClass: 'revenue-date-edit-vertical',
              revenueAmountClass: 'revenue-amount-edit-vertical bad-input',
            })
          }
        })
    }
  }

  const deleteRevenue = (revenueId) => {
    axios.delete(`${config.API_URL}/api/revenue/${revenueId}`, {
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

  const filterRevenues = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setFilters((prevFilter) => {
      if (typeof prevFilter[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevFilter, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevFilter, [fieldName]: 0 }
        }
      } else {
        return { ...prevFilter, [fieldName]: fieldValue }
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      FilterCategory: '',
      FilterReceiptDate: '',
      FilterAmount: 0,
    })
  }

  useEffect(() => {
    const getUserRevenues = async () => {
      let response = {}

      if (beginDate != null && endDate != null) {
        response = await axios.get(`${config.API_URL}/api/revenue`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            BeginDate: beginDate,
            EndDate: endDate,
          },
        })

        setUserRevenues({
          userRevenueData: response.data,
          isLoaded: true,
        })
      } else {
        if (displayMode === 'Modify') {
          response = await axios.get(`${config.API_URL}/api/revenue/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })

          setUserRevenues({
            userRevenueData: response.data,
            isLoaded: true,
          })
        } else if (displayMode === 'Wages') {
          response = await axios.get(`${config.API_URL}/api/revenue/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })

          const wageRecords = response.data.filter(
            (item) => item.RevenueCategory === 'Wages'
          )

          setUserRevenues({
            userRevenueData: wageRecords,
            isLoaded: true,
          })
        }
      }
    }

    getUserRevenues()
  }, [displayMode, beginDate, endDate])

  return (
    <div className="revenue-grid-vertical">
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
      {displayMode === 'Modify' && (
        <div className="filter-section">
          <div className="revenue-divider"></div>
          <p>Filters</p>
          <div className="data-row">
            <span>Category</span>
            <select
              name="FilterCategory"
              className="revenue-column-1"
              value={filters.FilterCategory}
              onChange={filterRevenues}
            >
              <option value="" disabled defaultValue hidden>
                Category Filter
              </option>
              <option value="Wages">Wages</option>
              <option value="IRS Tax Refund">IRS Tax Refund</option>
              <option value="Interest">Interest</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="data-row">
            <span>Receipt Date</span>
            <input
              type="date"
              name="FilterReceiptDate"
              className="revenue-column-3"
              value={filters.FilterReceiptDate}
              onChange={filterRevenues}
            ></input>
          </div>
          <div className="data-row">
            <span>Amount</span>
            <span className="revenue-column-4">
              <input
                type="number"
                name="FilterAmount"
                value={filters.FilterAmount}
                onChange={filterRevenues}
              ></input>
            </span>
          </div>
          <div className="button-section">
            <button className="revenue-column-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
      <div className="revenue-divider"></div>
      {!userRevenues.isLoaded ? (
        <LoadingIcon />
      ) : userRevenues.userRevenueData.length > 0 ? (
        userRevenues.userRevenueData
          .filter(
            (revenue) =>
              revenue.RevenueCategory.includes(filters.FilterCategory) &&
              revenue.RevenueDate.includes(filters.FilterReceiptDate) &&
              (revenue.RevenueAmount === filters.FilterAmount ||
                filters.FilterAmount === 0)
          )
          .map((revenue) => {
            return (
              <div key={revenue.ID} className="vertical-display">
                {revenue.ID === modifiedRecord.ID ? (
                  <>
                    <div className="data-row">
                      <span>Category</span>
                      <select
                        name="RevenueCategory"
                        className="revenue-category-edit-vertical"
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
                        className="revenue-name-edit-vertical"
                        value={modifiedRecord.RevenueName}
                        onChange={updateModifiedRecord}
                      ></input>
                    </div>
                    <div className="data-row">
                      <span>Receipt Date</span>
                      <input
                        type="date"
                        name="RevenueDate"
                        className={errorResult.revenueDateClass}
                        value={modifiedRecord.RevenueDate}
                        onChange={updateModifiedRecord}
                      ></input>
                    </div>
                    {errorResult.errorMessage.includes('Receipt Date') && (
                      <div className="modify-error-message">
                        <label>{errorResult.errorMessage}</label>
                      </div>
                    )}
                    <div className="data-row">
                      <span>Amount</span>
                      <input
                        type="number"
                        name="RevenueAmount"
                        className={errorResult.revenueAmountClass}
                        value={modifiedRecord.RevenueAmount.toString()}
                        onChange={updateModifiedRecord}
                      ></input>
                    </div>
                    {errorResult.errorMessage.includes('Amount') && (
                      <div className="modify-error-message">
                        <label>{errorResult.errorMessage}</label>
                      </div>
                    )}
                    <div className="data-row">
                      <span>Update</span>
                      <span
                        className="action-icon"
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
                        className="action-icon"
                        onClick={() => {
                          clearModifiedRecord()
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </div>
                    <div className="revenue-divider"></div>
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
                        <Moment format="MM/DD/YYYY">
                          {revenue.RevenueDate}
                        </Moment>
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
                    {displayMode !== 'View' && (
                      <>
                        <div className="data-row">
                          <span>Modify</span>
                          <span
                            className="action-icon"
                            onClick={() => {
                              modifyRevenue(revenue)
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </span>
                        </div>
                        <div className="data-row">
                          <span>Delete</span>
                          <span className="action-icon">
                            <Button
                              className="dialog-action-icon"
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
        <>
          <div className="no-records-found">
            No Upcoming Revenues found.{' '}
            {displayMode === 'View' && (
              <a href="/revenues">Add a new revenue now!</a>
            )}
          </div>
          <div className="revenue-divider"></div>
        </>
      )}
      <div className="total-row">
        <span>Total:</span>
        <span>
          {userRevenues.isLoaded && (
            <NumberFormat
              value={userRevenues.userRevenueData
                .filter(
                  (revenue) =>
                    revenue.RevenueCategory.includes(filters.FilterCategory) &&
                    revenue.RevenueDate.includes(filters.FilterReceiptDate) &&
                    (revenue.RevenueAmount === filters.FilterAmount ||
                      filters.FilterAmount === 0)
                )
                .reduce((sum, revenue) => sum + revenue.RevenueAmount, 0)}
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
