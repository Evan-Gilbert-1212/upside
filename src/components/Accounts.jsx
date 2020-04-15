import React, { useState, useEffect } from 'react'
import './Accounts.scss'
import '../ConfirmDialog.scss'
import axios from 'axios'
import NumberFormat from 'react-number-format'
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

const Accounts = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const { displayMode } = props

  const [userAccounts, setUserAccounts] = useState({
    userAccountData: [],
    isLoaded: false,
  })

  const [modifiedRecord, setModifiedRecord] = useState({})

  const [deleteDialogInfo, setDeleteDialogInfo] = useState({
    isOpen: false,
    accountId: 0,
  })

  let rowType = 'bank-account-row'

  if (displayMode === 'Modify') {
    rowType = 'bank-account-row-modify'
  }

  const getUserAccounts = async () => {
    const response = await axios.get(`${API_URL}/api/bankaccount`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    setUserAccounts({
      userAccountData: response.data,
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

  const modifyBankAccount = (account) => {
    setModifiedRecord({
      ID: account.ID,
      AccountType: account.AccountType,
      AccountBalance: parseFloat(account.AccountBalance),
      UserID: account.UserID,
    })
  }

  const clearModifiedRecord = () => {
    setModifiedRecord({})
  }

  const updateBankAccount = (accountData) => {
    const response = axios.put(`${API_URL}/api/bankaccount`, accountData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newAccountList = userAccounts.userAccountData.filter(
      (acc) => acc.ID !== accountData.ID
    )

    accountData = { ...accountData, User: null }

    setUserAccounts({
      userAccountData: [...newAccountList, accountData].sort(function (a, b) {
        if (a.AccountType < b.AccountType) {
          return -1
        }
        if (a.AccountType > b.AccountType) {
          return 1
        }
      }),
      isLoaded: true,
    })

    setModifiedRecord({})
  }

  const deleteBankAccount = (accountId) => {
    const response = axios.delete(`${API_URL}/api/bankaccount/${accountId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const newAccountList = userAccounts.userAccountData.filter(
      (acc) => acc.ID !== accountId
    )

    setUserAccounts({
      userAccountData: newAccountList,
      isLoaded: true,
    })

    setDeleteDialogInfo({
      isOpen: false,
      accountId: 0,
    })
  }

  useEffect(() => {
    getUserAccounts()
  }, [])

  return (
    <div className="account-grid">
      <Dialog
        open={deleteDialogInfo.isOpen}
        onClose={() => {
          setDeleteDialogInfo({
            isOpen: false,
            accountId: 0,
          })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this bank account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteBankAccount(deleteDialogInfo.accountId)
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
                accountId: 0,
              })
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div className={rowType}>
        <span className="bank-account-column-1">Bank Accounts</span>
        <span className="bank-account-column-2">Account Balance</span>
        {displayMode === 'Modify' && (
          <>
            <span className="bank-account-column-3">Modify</span>
            <span className="bank-account-column-4">Delete</span>
          </>
        )}
      </div>
      <div className="bank-account-divider"></div>
      {!userAccounts.isLoaded ? (
        <LoadingIcon />
      ) : userAccounts.userAccountData.length > 0 ? (
        userAccounts.userAccountData.map((account) => {
          return (
            <div key={account.ID} className={rowType}>
              {account.ID === modifiedRecord.ID ? (
                <>
                  <span className="bank-account-column-1">
                    <select
                      name="AccountType"
                      className="account-type-edit"
                      value={modifiedRecord.AccountType}
                      onChange={updateModifiedRecord}
                    >
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                    </select>
                  </span>
                  <span className="bank-account-column-2">
                    <input
                      type="text"
                      name="AccountBalance"
                      className="account-balance-edit"
                      value={modifiedRecord.AccountBalance}
                      onChange={updateModifiedRecord}
                    />
                  </span>
                  <span
                    className="bank-account-column-3"
                    onClick={() => {
                      updateBankAccount(modifiedRecord)
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className="bank-account-column-4"
                    onClick={() => {
                      clearModifiedRecord()
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </>
              ) : (
                <>
                  <span className="bank-account-column-1">
                    {account.AccountType}
                  </span>
                  <span className="bank-account-column-2">
                    {' '}
                    <NumberFormat
                      value={account.AccountBalance}
                      displayType={'text'}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      prefix={'$'}
                    />
                  </span>
                  {displayMode === 'Modify' && (
                    <>
                      <span
                        className="bank-account-column-3"
                        onClick={() => {
                          modifyBankAccount(account)
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className="bank-account-column-4">
                        <Button
                          className="action-icon"
                          onClick={() => {
                            setDeleteDialogInfo({
                              isOpen: true,
                              accountId: account.ID,
                            })
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No bank accounts found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/bank-accounts">Add a bank account now!</a>
          )}
        </div>
      )}
      <div className="bank-account-divider"></div>
      <div className={rowType}>
        <span className="bank-account-column-1">Total:</span>
        <span className="bank-account-column-2">
          {userAccounts.isLoaded && (
            <NumberFormat
              value={userAccounts.userAccountData.reduce(
                (sum, account) => sum + account.AccountBalance,
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

export default Accounts
