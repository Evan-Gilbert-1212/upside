import React from 'react'
import './MaintainRecurringTransactions.scss'
import RecurringTransactions from '../components/RecurringTransactions'
import RecurringTransactionsVertical from '../components/RecurringTransactionsVertical'
import Media from 'react-media'

const MaintainRecurringTransactions = () => {
  return (
    <>
      <div className="recurring-transactions-buffer"></div>
      <section className="recurring-transactions-display">
        <h2>Recurring Transactions</h2>
        <Media queries={{ horizontal: { minWidth: 900 } }}>
          {(matches) =>
            matches.horizontal ? (
              <RecurringTransactions displayMode="Modify" />
            ) : (
              <RecurringTransactionsVertical displayMode="Modify" />
            )
          }
        </Media>
      </section>
    </>
  )
}

export default MaintainRecurringTransactions
