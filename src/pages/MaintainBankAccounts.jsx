import React, { useState } from 'react'
import axios from 'axios'
import Accounts from '../components/Accounts'

const MaintainBankAccounts = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [accountInfo, setAccountInfo] = useState({
    AccountType: 'Checking',
    AccountBalance: 0,
  })

  const updateAccountInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setAccountInfo((prevAcctInfo) => {
      if (typeof prevAcctInfo[fieldName] === 'number') {
        return { ...prevAcctInfo, [fieldName]: parseFloat(fieldValue) }
      } else {
        return { ...prevAcctInfo, [fieldName]: fieldValue }
      }
    })
  }

  const addAccountToDb = async () => {
    const response = await axios.post(
      `${API_URL}/api/bankaccount`,
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
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Bank Accounts</h2>
        <h4>Add Account</h4>
        <section className="input-grid">
          <div>
            <label>Account Type</label>
            <select
              name="AccountType"
              className="account-dropdown"
              onChange={updateAccountInfo}
            >
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
      <section className="data-display">
        <h4>Your Accounts</h4>
        <Accounts displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainBankAccounts
