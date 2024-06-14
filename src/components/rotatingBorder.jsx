import React from 'react'
import "../css/rotatingBorder.css"

const rotatingBorder = (props) => {
  return (
    <div className="emptyPost text-center mx-auto mt-4 w-sm" >
    <h2>{props.message}</h2>
  </div>
  )
}

export default rotatingBorder