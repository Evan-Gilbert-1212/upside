import React from 'react'
import RecurringTransactions from '../components/RecurringTransactions'

const MaintainRecurringTransactions = () => {
  return (
    <>
      <div className="buffer"></div>
      <section className="data-display-extra-wide">
        <h2>Recurring Transactions</h2>
        <RecurringTransactions displayMode="Modify" />
      </section>
    </>
  )
}

export default MaintainRecurringTransactions
