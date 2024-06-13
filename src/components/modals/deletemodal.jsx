import React,{useState , useEffect , useContext}  from 'react'

const modal = (props) => {

  useEffect(() => {
    //is some error occured ot not
    if(props.isDelete === true){
      document.getElementById("modal-body").style.backgroundColor = "#13d57b"
      document.getElementById("modal-body").innerHTML = props.deleteMessage
    }
    else if(props.isDelete === false){
      document.getElementById("modal-body").innerHTML = props.deleteMessage
      document.getElementById("modal-body").style.backgroundColor = "#f8d7da"
    }
    else if(props.isDelete === null){
      document.getElementById("modal-body").innerHTML = "No-one can preview or download this file/files from your post(if posted)"
      document.getElementById("modal-body").style.backgroundColor = "#f8d7da"
    }
  }, [props.isDelete , props.deleteMessage])
  

  //function for handelling delete button
  const handeldelete = async(e)=>{
    e.preventDefault()
    e.target.disabled = true
    document.getElementById("closebutton").disabled = true
    e.target.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Deleting...`
    document.getElementById("modal-body").innerHTML ="Processing...Please don't refresh"
    document.getElementById("modal-body").style.backgroundColor = "#f8d7da"
    setTimeout(async() => {
      await props.deleteNoteById()
      //buttons after deleting notes
      document.getElementById("closebutton").removeAttribute("disabled")
      e.target.disabled = false
      e.target.innerHTML = `Deleted`
    }, 2000);
  }

  //function on click the closing button
  const handelClose = async ()=>{
    props.setisDelete(null)
    props.setdeleteMessage("")
  }

  return (
    <div
    className={"modal fade"}
    id="exampleModal1"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content bg-danger-subtle" style={ {backgroundColor : "rgb(255, 250, 183)"}}>
        <div className="modal-header " style={{background : "#ff6a6a"}}>
          <h1 className="modal-title fs-5" id="exampleModalLabel">
            Delete Notes
          </h1>
        </div>
        <div className="modal-body fs-5 fw-semibold " id='modal-body' style={{backgroundColor : "#f8d7da"}}></div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            id='closebutton'
            onClick={handelClose}
          >
            Close
          </button>
          <button type="button" className="btn btn-danger" id='deletebutton' onClick={handeldelete} >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default modal