import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const AddBankAccount = () => {
  const [accountInfo, setAccountInfo] = useState({
    AccountType: 'Checking',
    AccountBalance: 0,
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const updateAccountInfo = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setAccountInfo((prevAcctInfo) => {
      if (typeof prevAcctInfo[fieldName] === 'number') {
        prevAcctInfo[fieldName] = parseFloat(fieldValue)
      } else {
        prevAcctInfo[fieldName] = fieldValue
      }
      return prevAcctInfo
    })
  }

  const addAccountToDb = async () => {
    console.log(accountInfo)

    const response = await axios.post(
      'https://upside-api.herokuapp.com/api/bankaccount',
      accountInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    console.log(response.data)

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/home" />
  }

  return (
    <>
      <div className="buffer"></div>
      <section className="entry-form">
        <h2>Add Bank Account</h2>
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
        </section>
        <button onClick={addAccountToDb}>Add Account</button>
      </section>
    </>
  )
}

export default AddBankAccount
