import React from 'react'


const alert = (props) => {

  return (

   props.isdisplay && <div>
        <div className={`alert alert-${props.mode} z-3 fw-bold`} role="alert">
        {`${props.message}`}
      </div>
    </div>
  )
}

export default alert