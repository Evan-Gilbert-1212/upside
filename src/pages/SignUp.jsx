import React, { useState } from 'react'
import axios from 'axios'
import './SignUp.scss'
import config from '../config'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import LoadingIcon from '../components/LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

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

  const [loadingState, setLoadingState] = useState({
    loadingMessage: '',
    showDialog: false,
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
    setLoadingState({
      loadingMessage: 'Signing Up...',
      showDialog: true,
    })

    await axios
      .post(`${config.API_URL}/auth/signup`, userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('temp-token', response.data.token)

          window.location = '/new-user-setup'
        }
      })
      .catch((error) => {
        setLoadingState({
          loadingMessage: '',
          showDialog: false,
        })

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

  const CreateDemoAccount = async () => {
    setLoadingState({
      loadingMessage: 'Logging in to Demo Account...',
      showDialog: true,
    })

    await axios.post(`${config.API_URL}/auth/demouser`).then((response) => {
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)

        window.location = '/'
      }
    })
  }

  return (
    <section className="signup-page">
      <Dialog
        open={loadingState.showDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            {loadingState.loadingMessage}
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
        <div className="create-demo-account">
          Want to try it out first?{' '}
          <button onClick={CreateDemoAccount}>View demo account.</button>
          <p>Demo account will be pre-filled with sample data.</p>
        </div>
      </section>
      <footer>
        <label>Created by Evan Gilbert</label>
        <div>
          <a
            title="Evan Gilberts LinkedIn Profile"
            href="https://www.linkedin.com/in/evangilbert1212/"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            title="Evan Gilberts GitHub Repository"
            href="https://github.com/Evan-Gilbert-1212"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </footer>
    </section>
  )
}

export default SignUp
