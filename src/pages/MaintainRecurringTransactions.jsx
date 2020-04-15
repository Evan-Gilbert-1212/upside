import React from 'react'
import './MaintainRecurringTransactions.scss'
import RecurringTransactions from '../components/RecurringTransactions'

const MaintainRecurringTransactions = () => {
  return (
    <>
      <div className="recurring-transactions-buffer"></div>
      <section className="recurring-transactions-display">
        <h2>Recurring Transactions</h2>
        <RecurringTransactions displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainRecurringTransactions
