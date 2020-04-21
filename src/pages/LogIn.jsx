import React, { useState } from 'react'
import axios from 'axios'
import './LogIn.scss'
import config from '../config'

const LogIn = () => {
  const [userData, setUserData] = useState({})

  const updateUserData = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setUserData((prevUserData) => {
      prevUserData[fieldName] = fieldValue
      return prevUserData
    })
  }

  const [errorMessage, setErrorMessage] = useState('')

  const LogInUser = async () => {
    const resp = await axios
      .post(`${config.API_URL}/auth/login`, userData)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.userInfo.displayPeriod === null) {
            localStorage.setItem('temp-token', response.data.token)

            window.location = '/new-user-setup'
          } else {
            localStorage.setItem('token', response.data.token)

            window.location = '/'
          }
        }
      })
      .catch((error) => {
        setErrorMessage('Login Unsuccessful. Please Try Again.')
      })
  }

  return (
    <section className="login-page">
      <section className="login-form">
        <h2>Welcome to Upside Budget Manager</h2>
        <section className="login-grid">
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="UserName"
              placeholder="User Name"
              onChange={updateUserData}
            ></input>
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Password"
              onChange={updateUserData}
            ></input>
          </div>
        </section>
        <label className="login-error-message">{errorMessage}</label>
        <button onClick={LogInUser}>Log In</button>
        <div className="create-an-account">
          Not a user yet? <a href="/signup">Create an account!</a>
        </div>
      </section>
    </section>
  )
}

export default LogIn
