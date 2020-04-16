import React from 'react'
import './MaintainRecurringTransactions.scss'
import RecurringTransactions from '../components/RecurringTransactions'
import RecurringTransactionsVertical from '../components/RecurringTransactionsVertical'

const MaintainRecurringTransactions = () => {
  return (
    <section className="page-background">
      <div className="recurring-transactions-buffer"></div>
      <section className="recurring-transactions-display">
        <h2>Recurring Transactions</h2>
        <RecurringTransactions displayMode="Modify" />
        <RecurringTransactionsVertical displayMode="Modify" />
      </section>
    </section>
  )
}

export default MaintainRecurringTransactions
