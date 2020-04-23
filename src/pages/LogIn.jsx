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
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)

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
        setIsLoading(false)
      })
  }

  return (
    <section className="login-page">
      <Dialog
        open={isLoading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Logging In...
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
      </section>
      <footer>
        <label>Created by Evan Gilbert</label>
        <div>
          <a href="https://www.linkedin.com/in/evangilbert1212/">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/Evan-Gilbert-1212">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </footer>
    </section>
  )
}

export default LogIn
