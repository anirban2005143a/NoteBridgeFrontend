import React , {useState , useEffect ,useContext} from 'react'
import NoteContext from "../context/notes/noteContext";

const folderPath = (props) => {
    const value = useContext(NoteContext);
    //state for folder path
    const [path, setpath] = useState("MainSection")

    //function to handel path
    const handelPath = async(e)=>{
        const index = Array.from(document.getElementsByClassName("handelPath")).indexOf(e.currentTarget)
        const folderName = document.getElementsByClassName("folderNamePath")[index].innerHTML
        const newPath = localStorage.getItem("folderPath").split(",").slice(0 , index+1)
        localStorage.setItem("folderPath" , newPath)
        //set values for alert
        props.changeFolder === false ? props.setchangeFolder(true): props.setchangeFolder(false)
        props.setnewFolderSwitch === true ? props.setnewFolderSwitch(false):props.setnewFolderSwitch(true)
         value.setisOK(true)
        value.setmessage(`Folder changed to ${folderName} ...Please wait to fetch data `)
        
    }

    useEffect(() => {
        if(localStorage.getItem("folderPath")){
            setpath(localStorage.getItem("folderPath").split(",").join("/"))
        }
    }, [props.changeFolder])

  return (
    <div className='handelPath user-select-none' onClick={handelPath} style={{cursor:"pointer"}} >
      <p className='fs-6 fw-medium folderNamePath px-2 py-1 rounded-4 mx-2' style={{backgroundColor:"#80808061"}}>{props.path}</p> 
    </div>
  )
}

export default folderPath