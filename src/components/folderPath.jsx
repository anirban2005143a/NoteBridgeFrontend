import React, { useState, useEffect, useContext } from 'react'
import NoteContext from "../context/notes/noteContext";

const folderPath = (props) => {
  const value = useContext(NoteContext);

  //state for folder path
  const [path, setpath] = useState("MainSection")

  //function to handel path
  const handelPath = async (e) => {
    const index = Array.from(document.getElementsByClassName("handelPath")).indexOf(e.currentTarget)
    const folderName = document.getElementsByClassName("folderNamePath")[index].innerHTML
    const newPath = localStorage.getItem("folderPath").split(",").slice(0, index + 1)
    localStorage.setItem("folderPath", newPath)
    //set values for alert
    props.changeFolder === false ? props.setchangeFolder(true) : props.setchangeFolder(false)
    props.setnewFolderSwitch === true ? props.setnewFolderSwitch(false) : props.setnewFolderSwitch(true)
    value.setisOK(true)
    value.setmessage(`Folder changed to ${folderName} ...Please wait to fetch data `)

  }

  useEffect(() => {
    if (localStorage.getItem("folderPath")) {
      setpath(localStorage.getItem("folderPath").split(",").join("/"))
    }
  }, [props.changeFolder])

  return (
    <div className='handelPath user-select-none d-flex' onClick={handelPath}  >
      <div className="svg my-2" style={{ width: "35px", cursor: 'default' }}>
        <svg fill='white' className='w-100' version="1.1" viewBox="0 0 2896 2896" xmlns="http://www.w3.org/2000/svg">
          <path transform="translate(1679,893)" d="m0 0h422l53 2 31 3 43 7 32 8 27 8 18 7 17 6 35 16 22 11 23 14 22 14 19 14 21 16 15 13 15 14 8 7 12 12 7 8 1 3h2l9 11 10 11 28 38 9 14 17 28 14 27 13 28 9 24 9 25 10 38 6 28 6 42 3 48v21l-2 37-3 27-6 37-12 48-12 35-10 25-9 19-10 21-14 24-8 13-7 11-14 19-10 14-13 16-14 15-7 8-11 12-8 8-8 7-12 11-11 10-12 9-30 22-19 12-17 10-21 12-28 13-20 9-40 14-25 7-30 7-43 7-34 3-21 1h-462l-18-2-20-6-18-10-13-10-10-10-10-14-9-17-6-20-2-15v-14l3-19 6-18 11-20 9-11 11-11 11-8 17-9 16-5 8-2 12-1 443-1 29-1 22-2 29-5 29-8 25-9 22-10 20-11 20-13 18-13 11-10h2v-2l8-7 9-8 1-2h2l2-4 6-7h2l2-4 9-10 13-18 9-14 12-21 12-26 7-19 5-15 6-25 5-33 1-16v-35l-2-25-5-29-8-30-9-25-12-26-10-18-12-19-16-21-11-12-12-13-8-8-8-7-10-9-14-10-18-12-15-9-28-14-24-9-15-5-28-7-27-4-28-2-457-1-20-2-21-7-20-11-12-11-5-5-9-10-10-17-5-12-4-14-2-15v-12l2-18 6-19 8-16 8-11 9-11 13-11 19-11 17-6 17-3z" />
          <path transform="translate(797,893)" d="m0 0h417l23 1 15 2 18 6 17 9 13 10 12 12 9 13 9 17 5 16 2 14v22l-2 15-6 18-8 15-4 7-8 10h-2l-2 4-14 12-23 12-21 6-19 2-458 1-27 2-30 5-28 7-28 10-29 14-16 9-21 14-12 9-11 9-12 11-3 1v2l-5 4-1 2h-2l-2 4-9 9-8 10-11 14-10 15-12 20-8 15-10 23-10 29-7 30-4 27-1 10-1 29 2 33 4 27 6 25 6 20 11 28 12 24 13 21 13 19 11 13 7 8 12 13 8 8 8 7 13 11 18 13 19 12 16 9 23 11 28 10 17 5 22 5 29 4 11 1 33 1 439 1 17 2 17 5 16 8 10 7 10 8 7 7 9 12 9 16 5 14 3 12 1 9v22l-2 14-5 16-8 16-7 11-12 13-9 8-15 9-16 7-15 4-16 2h-463l-48-3-40-6-23-5-35-9-40-14-24-10-35-17-18-10-18-11-17-11-20-15-14-10-15-13-8-7-16-15-9-8v-2h-2l-7-8-15-16-9-11-12-15-10-14-12-16-17-28-11-19-14-28-11-25-14-38-7-25-7-28-4-21-6-42-2-34v-41l2-35 6-41 5-25 7-28 8-26 15-41 22-45 8-14 12-20 10-16 14-18 10-14 13-16 10-11 1-2h2l2-4 9-9 7-8 12-11 14-13 11-9 12-10 18-13 16-12 15-9 28-17 30-15 27-12 33-12 23-7 37-9 35-6 36-4 21-1z" />
          <path transform="translate(1016,1336)" d="m0 0h851l34 1 15 2 18 6 19 10 11 9 10 9 10 13 10 19 5 15 3 17v21l-3 18-4 12-8 16-6 10-11 12-5 5-11 9-14 8-19 7-16 3-9 1h-898l-20-3-18-6-15-8-12-9-7-6-7-8-8-11-10-19-6-21-2-16 1-16 3-17 5-14 8-16 8-11 9-10 10-9 14-9 15-7 14-4 13-2z" />
        </svg>
      </div>
      <p className=' rounded-4 mx-2 fst-italic my-2' style={{
        backgroundColor: "#80808061",
        cursor: "pointer",
        fontSize: '15px',
        padding: "5px 10px",
        fontWeight: '400',
        color: 'white',
        transition: 'all 500ms ease'
      }}
        onMouseOver={(e) => {
          e.currentTarget.style.scale = 1.045
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.scale = 1
        }}>{props.path}</p>
    </div>
  )
}

export default folderPath