import React from 'react'
import "../css/rotatingBorder.css"

const rotatingBorder = (props) => {
  return (
    <div className="emptyPost text-center mx-auto w-50 mt-4 " >
    <h2>{props.message}</h2>
  </div>
  )
}

export default rotatingBorder