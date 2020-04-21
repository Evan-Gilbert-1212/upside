import React, { useState } from 'react'
import './NewUserSetup.scss'
import axios from 'axios'
import config from '../config'

const NewUserSetup = () => {
  const [buttonClass, setButtonClass] = useState('button-disabled')
  const [displayPeriod, setDisplayPeriod] = useState('')

  const updateDisplayPeriod = (e) => {
    setDisplayPeriod(e.target.value)

    if (buttonClass === 'button-disabled') {
      setButtonClass('button-enabled')
    }
  }

  const updateUserDisplayPeriod = async () => {
    const resp = await axios
      .patch(
        `${config.API_URL}/api/user/updateperiod/`,
        { displayPeriod: displayPeriod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('temp-token')}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (displayPeriod === 'Monthly') {
            var userToken = localStorage.getItem('temp-token')

            localStorage.removeItem('temp-token')

            localStorage.setItem('token', userToken)

            window.location = '/'
          } else if (displayPeriod === 'Wages') {
            window.location = '/add-wages'
          }
        }
      })
      .catch((error) => {
        //Something went wrong
      })
  }

  return (
    <section className="new-user-setup-page">
      <div className="new-user-setup-buffer"></div>
      <div className="new-user-setup">
        <h2>Welcome to Upside Budget Manager</h2>
        <p>
          This website is designed to allow you to enter bank accounts, credit
          cards, expenses and revenues to give you a summary of your cash flow.
          The home page will display your expenses, revenues and disposable
          income on a "period" basis.
        </p>
        <p>
          In order to complete setup of your account, we need to know how you
          prefer to see your data. Please select one of the options below to
          continue:
        </p>
        <div className="radio-selection">
          <input
            type="radio"
            id="Monthly"
            value="Monthly"
            name="period-selection"
            onClick={updateDisplayPeriod}
          ></input>
          <label for="Monthly">
            Monthly - this option will set your period to be from the 1st of
            each month to the end of the month.
          </label>
          <input
            type="radio"
            id="Wages"
            value="Wages"
            name="period-selection"
            onClick={updateDisplayPeriod}
          ></input>
          <label for="Wages">
            By Paycheck - this option will set your period to be between
            paychecks. Periods will start on the date you receive a paycheck,
            and will end the day before your next paycheck is scheduled to be
            recieved. To use this option, you will be prompted to add recurring
            paycheck information.
          </label>
        </div>
        <div className="button-section">
          <button className={buttonClass} onClick={updateUserDisplayPeriod}>
            Continue
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewUserSetup
