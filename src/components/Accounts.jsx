import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NumberFormat from 'react-number-format'

const Accounts = () => {
  const [userAccounts, setUserAccounts] = useState({
    userAccountData: [],
    isLoaded: false,
  })

  const getUserAccounts = async () => {
    const response = await axios.get(
      'https://upside-api.herokuapp.com/api/bankaccount/1'
    )
    setUserAccounts({
      userAccountData: response.data,
      isLoaded: true,
    })
  }

  useEffect(() => {
    getUserAccounts()
  }, [])

  if (!userAccounts.isLoaded) {
    return <h2>Loading...</h2>
  } else {
    return (
      <div className="accounts-section">
        <div className="account-row">
          <span>Bank Accounts</span>
          <span>Account Balance</span>
        </div>
        <div className="account-divider"></div>
        {userAccounts.userAccountData.map((account) => {
          return (
            <div className="account-row">
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
        })}
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
}

export default Accounts
