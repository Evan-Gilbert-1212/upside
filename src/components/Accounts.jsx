import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import LoadingIcon from './LoadingIcon'

const Accounts = () => {
  const [userAccounts, setUserAccounts] = useState({
    userAccountData: [],
    isLoaded: false,
  })

  const getUserAccounts = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/bankaccount',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    setUserAccounts({
      userAccountData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserAccounts()
  }, [])

  return (
    <div className="accounts-section">
      <div className="account-row">
        <span>Bank Accounts</span>
        <span>Account Balance</span>
      </div>
      <div className="account-divider"></div>
      {!userAccounts.isLoaded ? (
        <LoadingIcon />
      ) : userAccounts.userAccountData.length > 0 ? (
        userAccounts.userAccountData.map((account) => {
          return (
            <div key={account.ID} className="account-row">
              <span>{account.AccountType}</span>
              <span>
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
            </div>
          )
        })
      ) : (
        <div className="no-records-found">
          No bank accounts found.{' '}
          <a href="/add-account">Add a Bank Account now!</a>
        </div>
      )}
      <div className="account-divider"></div>
      <div className="account-row">
        <span>Total:</span>
        <span>
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
        </span>
      </div>
    </div>
  )
}

export default Accounts
