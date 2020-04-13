import React, { useState } from 'react'
import axios from 'axios'

const SignUp = () => {
  const API_URL = 'https://upside-api.herokuapp.com'

  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    UserName: '',
    Password: '',
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    userNameClass: '',
    passwordClass: '',
  })

  const updateUserData = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setUserData((prevUserData) => {
      prevUserData[fieldName] = fieldValue
      return prevUserData
    })
  }

  const SignUpUser = async () => {
    console.log(userData)
    const resp = await axios
      .post(`${API_URL}/auth/signup`, userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token)

          window.location = '/'
        }
      })
      .catch((error) => {
        if (error.response.data.includes('User Name')) {
          setErrorResult({
            errorMessage: error.response.data,
            userNameClass: 'bad-input',
          })
        } else if (error.response.data.includes('Password')) {
          setErrorResult({
            errorMessage: error.response.data,
            passwordClass: 'bad-input',
          })
        }
      })
  }

  return (
    <section className="login-signup-page">
      <section className="login-signup-form">
        <h2>Welcome to Upside Budget Manager</h2>
        <section className="login-signup-grid">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="FirstName"
              placeholder="First Name"
              onChange={updateUserData}
            ></input>
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="LastName"
              placeholder="Last Name"
              onChange={updateUserData}
            ></input>
          </div>
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="UserName"
              placeholder="User Name"
              className={errorResult.userNameClass}
              onChange={updateUserData}
            ></input>
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Password"
              className={errorResult.passwordClass}
              onChange={updateUserData}
            ></input>
          </div>
        </section>
        <label className="error-message">{errorResult.errorMessage}</label>
        <button onClick={SignUpUser}>Sign Up</button>
        <div className="create-an-account">
          Already a User? <a href="/login">Log in Now!</a>
        </div>
      </section>
    </section>
  )
}

export default SignUp
