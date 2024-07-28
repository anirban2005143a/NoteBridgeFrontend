import React from 'react'
import '../css/pageLoader.css'

const pageLoader = () => {
  return (
    <div className=' d-flex justify-content-center pageLoader w-100 my-5 py-4'>
      <div class="loader">
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
      </div>
    </div>
  )
}

export default pageLoader