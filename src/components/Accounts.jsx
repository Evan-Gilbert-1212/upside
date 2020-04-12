import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Accounts = (props) => {
  const API_URL = 'https://upside-api.herokuapp.com'
  // const API_URL = 'https://localhost:5001'

  const { displayMode } = props

  const [userAccounts, setUserAccounts] = useState({
    userAccountData: [],
    isLoaded: false,
  })

  let rowType = 'account-row'

  if (displayMode === 'Modify') {
    rowType = 'account-row-modify'
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

  const modifyBankAccount = () => {
    //Modify the bank account
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
  }

  useEffect(() => {
    getUserAccounts()
  }, [])

  return (
    <div className="accounts-section">
      <div className={rowType}>
        <span className="account-column-1">Bank Accounts</span>
        <span className="account-column-2">Account Balance</span>
        {displayMode === 'Modify' && (
          <>
            <span className="account-column-3">Modify</span>
            <span className="account-column-4">Delete</span>
          </>
        )}
      </div>
      <div className="account-divider"></div>
      {!userAccounts.isLoaded ? (
        <LoadingIcon />
      ) : userAccounts.userAccountData.length > 0 ? (
        userAccounts.userAccountData.map((account) => {
          return (
            <div key={account.ID} className={rowType}>
              <span className="account-column-1">{account.AccountType}</span>
              <span className="account-column-2">
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
                    className="account-column-3"
                    onClick={modifyBankAccount}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span
                    className="account-column-4"
                    onClick={() => {
                      deleteBankAccount(account.ID)
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
          No bank accounts found.{' '}
          {displayMode !== 'Modify' && (
            <a href="/bank-accounts">Add a bank account now!</a>
          )}
        </div>
      )}
      <div className="account-divider"></div>
      <div className={rowType}>
        <span className="account-column-1">Total:</span>
        <span className="account-column-2">
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
