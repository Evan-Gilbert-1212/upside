import React, { useState } from 'react'
import axios from 'axios'
import './LogIn.scss'
import config from '../config'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import LoadingIcon from '../components/LoadingIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const LogIn = () => {
  const [userData, setUserData] = useState({})
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

  const [errorMessage, setErrorMessage] = useState('')

  const LogInUser = async () => {
    setLoadingState({
      loadingMessage: 'Logging In...',
      showDialog: true,
    })

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
        setLoadingState({
          loadingMessage: '',
          showDialog: false,
        })
      })
  }

  const CreateDemoAccount = async () => {
    setLoadingState({
      loadingMessage: 'Logging in to Demo Account...',
      showDialog: true,
    })

    const resp = await axios
      .post(`${config.API_URL}/auth/demouser`)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token)

          window.location = '/'
        }
      })
  }

  return (
    <section className="login-page">
      <Dialog
        open={loadingState.showDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loadingState.loadingMessage}
            <LoadingIcon />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
        <div className="create-demo-account">
          Want to try it out first?{' '}
          <a onClick={CreateDemoAccount}>View demo account.*</a>
          <p>* Demo account will be pre-filled with sample data.</p>
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

export default LogIn
