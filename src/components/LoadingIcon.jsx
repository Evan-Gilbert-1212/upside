import React from 'react'

const LoadingIcon = () => {
  return (
    <>
      <div className="loading-buffer"></div>
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
      <div className="loading-buffer"></div>
    </>
  )
}

export default LoadingIcon
