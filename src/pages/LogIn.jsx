import React, { useState } from 'react'
import axios from 'axios'

const LogIn = () => {
  const API_URL = 'https://upside-api.herokuapp.com'
  // const API_URL = 'https://localhost:5001'

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
      .post(`${API_URL}/auth/login`, userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token)

          window.location = '/'
        }
      })
      .catch((error) => {
        setErrorMessage('Login Unsuccessful. Please Try Again.')
      })
  }

  return (
    <section className="login-signup-page">
      <section className="login-signup-form">
        <h2>Welcome to Upside Budget Manager</h2>
        <section className="login-signup-grid">
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
        <label className="error-message">{errorMessage}</label>
        <button onClick={LogInUser}>Log In</button>
        <div className="create-an-account">
          Not a User Yet? <a href="/signup">Create an Account!</a>
        </div>
      </section>
    </section>
  )
}

export default LogIn
