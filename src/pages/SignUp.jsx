import React, { useState } from 'react'
import axios from 'axios'
import './SignUp.scss'
import config from '../config'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import LoadingIcon from '../components/LoadingIcon'

const SignUp = () => {
  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    UserName: '',
    Password: '',
  })

  const [errorResult, setErrorResult] = useState({
    errorMessage: '',
    firstNameClass: '',
    userNameClass: '',
    passwordClass: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const updateUserData = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setUserData((prevUserData) => {
      prevUserData[fieldName] = fieldValue
      return prevUserData
    })
  }

  const SignUpUser = async () => {
    setIsLoading(true)

    const resp = await axios
      .post(`${config.API_URL}/auth/signup`, userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('temp-token', response.data.token)

          window.location = '/new-user-setup'
        }
      })
      .catch((error) => {
        setIsLoading(false)

        if (error.response.data.includes('First Name')) {
          setErrorResult({
            errorMessage: error.response.data,
            firstNameClass: 'bad-input',
            userNameClass: '',
            passwordClass: '',
          })
        } else if (error.response.data.includes('User Name')) {
          setErrorResult({
            errorMessage: error.response.data,
            firstNameClass: '',
            userNameClass: 'bad-input',
            passwordClass: '',
          })
        } else if (error.response.data.includes('Password')) {
          setErrorResult({
            errorMessage: error.response.data,
            firstNameClass: '',
            userNameClass: '',
            passwordClass: 'bad-input',
          })
        }
      })
  }

  return (
    <section className="signup-page">
      <Dialog
        open={isLoading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Signing Up...
            <LoadingIcon />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <section className="signup-form">
        <h2>Welcome to Upside Budget Manager</h2>
        <section className="signup-grid">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="FirstName"
              placeholder="First Name"
              className={errorResult.firstNameClass}
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
        <label className="signup-error-message">
          {errorResult.errorMessage}
        </label>
        <button onClick={SignUpUser}>Sign Up</button>
        <div className="log-in-now">
          Already a user? <a href="/login">Log in now!</a>
        </div>
      </section>
    </section>
  )
}

export default SignUp
