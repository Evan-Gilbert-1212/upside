import React, { useState } from 'react'
import './MaintainBankAccounts.scss'
import axios from 'axios'
import Accounts from '../components/Accounts'
import config from '../config'

const MaintainBankAccounts = () => {
  const [accountInfo, setAccountInfo] = useState({
    AccountType: 'Checking',
    AccountBalance: 0,
  })

  const updateAccountInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setAccountInfo((prevAcctInfo) => {
      if (typeof prevAcctInfo[fieldName] === 'number') {
        if (parseFloat(fieldValue) > 0) {
          return { ...prevAcctInfo, [fieldName]: parseFloat(fieldValue) }
        } else {
          return { ...prevAcctInfo, [fieldName]: 0 }
        }
      } else {
        return { ...prevAcctInfo, [fieldName]: fieldValue }
      }
    })
  }

  const addAccountToDb = async () => {
    const response = await axios.post(
      `${config.API_URL}/api/bankaccount`,
      accountInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    if (response.status === 201) {
      //Any logic for successful Save
      window.location = '/bank-accounts'
    }
  }

  return (
    <section className="page-background">
      <div className="bank-account-buffer"></div>
      <section className="bank-account-entry-form">
        <h2>Bank Accounts</h2>
        <h4>Add Account</h4>
        <section className="bank-account-input-grid">
          <div>
            <label>Account Type</label>
            <select name="AccountType" onChange={updateAccountInfo}>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
            </select>
          </div>
          <div>
            <label>Opening Balance</label>
            <input
              type="text"
              placeholder="Enter Account Balance"
              name="AccountBalance"
              onChange={updateAccountInfo}
            ></input>
          </div>
          <button onClick={addAccountToDb}>Add Account</button>
        </section>
      </section>
      <section className="bank-account-data-display">
        <h4>Your Bank Accounts</h4>
        <Accounts displayMode="Modify" />
      </section>
    </section>
  )
}

export default MaintainBankAccounts
