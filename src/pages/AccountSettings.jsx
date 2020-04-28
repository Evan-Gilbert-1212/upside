import React, { useState, useEffect } from 'react'
import './AccountSettings.scss'
import axios from 'axios'
import config from '../config'

const AccountSettings = () => {
  const [displayPeriod, setDisplayPeriod] = useState('')
  const [hasWagesRecords, setHasWagesRecords] = useState(false)

  const saveSettings = async () => {
    await axios
      .patch(
        `${config.API_URL}/api/user/updateperiod/`,
        { displayPeriod: displayPeriod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          //If user selected "By Paycheck" and has no wage records, redirect them to Add Wages
          if (displayPeriod === 'Wages' && !hasWagesRecords) {
            window.location = '/add-wages'
          }
        }
      })
      .catch((error) => {
        //Something went wrong
      })
  }

  const getDisplayPeriod = async () => {
    const response = await axios.get(`${config.API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    setDisplayPeriod(response.data.DisplayPeriod)
  }

  useEffect(() => {
    getDisplayPeriod()
  }, [])

  useEffect(() => {
    const CheckForWagesRecords = async () => {
      if (displayPeriod === 'Wages') {
        const response = await axios.get(`${config.API_URL}/api/revenue/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const wagesRecords = response.data.filter(
          (item) => item.RevenueCategory === 'Wages'
        )

        if (wagesRecords.length > 0) {
          setHasWagesRecords(true)
        } else {
          setHasWagesRecords(false)
        }
      }
    }

    CheckForWagesRecords()
  }, [displayPeriod])

  return (
    <div className="account-settings-page">
      <div className="account-settings-buffer"></div>
      <h2>Account Settings</h2>
      <div className="account-settings">
        <h4>Display Period</h4>
        <div className="settings-radio-selection">
          <input
            type="radio"
            id="Monthly"
            value="Monthly"
            name="period-selection"
            checked={displayPeriod === 'Monthly'}
            onChange={() => {
              setDisplayPeriod('Monthly')
            }}
          ></input>
          <label htmlFor="Monthly">
            Monthly - this option will set your period to be from the 1st of
            each month to the end of the month.
          </label>
          <input
            type="radio"
            id="Wages"
            value="Wages"
            name="period-selection"
            checked={displayPeriod === 'Wages'}
            onChange={() => {
              setDisplayPeriod('Wages')
            }}
          ></input>
          <label htmlFor="Wages">
            By Paycheck - this option will set your period to be between
            paychecks. Periods will start on the date you receive a paycheck,
            and will end the day before your next paycheck is scheduled to be
            recieved. To use this option, you will be prompted to add recurring
            paycheck information.
          </label>
        </div>
        {displayPeriod === 'Wages' && hasWagesRecords && (
          <label className="wages-status-ok">
            Wage records detected. Your account is ready for this display
            option.
          </label>
        )}
        {displayPeriod === 'Wages' && !hasWagesRecords && (
          <label className="wages-status-incomplete">
            No wage records detected. You will be prompted to add them upon
            saving.
          </label>
        )}
      </div>
      <div className="button-section">
        <button className="save-settings-button" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default AccountSettings
