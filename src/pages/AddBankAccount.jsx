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

  // Hard-coded to UserID 1 for now, will be updated when users are added
  const addAccountToDb = async () => {
    console.log(accountInfo)

    const response = await axios.post(
      'https://upside-api.herokuapp.com/api/bankaccount/1',
      accountInfo
    )

    console.log(response.data)

    if (response.status === 201) {
      setShouldRedirect(true)
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/" />
  }

  return (
    <section className="add-bank-account">
      <h2>Add Account</h2>
      <label>Account Type</label>
      <select
        name="AccountType"
        className="account-dropdown"
        onChange={updateAccountInfo}
      >
        <option value="Checking">Checking</option>
        <option value="Savings">Savings</option>
      </select>
      <label>Opening Balance</label>
      <input
        type="text"
        placeholder="Enter Account Balance"
        name="AccountBalance"
        // value={accountInfo.AccountBalance}
        onChange={updateAccountInfo}
      ></input>
      <button onClick={addAccountToDb}>Add Account</button>
    </section>
  )
}

export default AddBankAccount
