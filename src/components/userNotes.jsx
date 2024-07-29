import React, { useState, useEffect, useContext } from "react";
import NoteCard from "./noteCard";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import { deleteFileFromFirebase } from "../firebase/deletefile";
import '../css/userNotes.css'
import NoteContext from "../context/notes/noteContext";
import DeleteModal from "./modals/deletemodal";
import Folder from "./folder";
import FolderPath from "./folderPath";
import UploadModal from "./modals/uploadModal"
import CreateFolder from "./inputForms/createFolder";
import ShareModal from "./modals/shareModal";
import Alert from "./alert";
import PageLoader from "./pageLoader";
import RotatingBorder from "./rotatingBorder";

const UserNotes = () => {
  const value = useContext(NoteContext);
  const socket = io(`${value.host}`);

  const [isloaded, setisloaded] = useState(null)

  const [notes, setnotes] = useState([]); //state to save all notes in a array
  const [notesId, setnotesId] = useState([]); //state to save all selected note id in an array , by default all notes are selected
  const [folderId, setfolderId] = useState([]);
  //state for folder path
  const [folderPathArray, setfolderPathArray] = useState(["MainSection"]);

  //state for number of folders anf forlder names
  const [folders, setfolders] = useState([]);
  const [firstCreate, setfirstCreate] = useState(null);
  const [tempFolderName, settempFolderName] = useState("");
  const [isCreated, setisCreated] = useState(false);
  const [changeFolder, setchangeFolder] = useState(false);
  const [newFolderSwitch, setnewFolderSwitch] = useState(false);

  //state for modal component
  const [isDelete, setisDelete] = useState(null);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [shareurl, setshareurl] = useState(null)

  const [like, setlike] = useState(false)
  const [view, setview] = useState(false)
  const [follow, setfollow] = useState(false)
  const [comments, setcomments] = useState([])


  useEffect(() => {
    socket.emit("userConnected", `${value.userId}`); //connect to io

    //get accept req status
    socket.on("acceptReq", (data) => {
      setfollow(!follow);
    });
    //socket reply of followReqStatus
    socket.on("postComment", (data) => {
      setcomments(data)
    });
    //get accept req status
    socket.on("denyReq", (data) => {
      setfollow(!follow);
    });
    //socket reply for likes
    socket.on("postLike", (data) => {
      setlike(!like)
    });

    //socket reply of view request status
    socket.on("viewReq", (data) => {
      setview(!view);
    });

    //socket reply of followReqStatus
    socket.on("followReqStatus", (data) => {
      setfollow(!follow);
    });
  }, [])

  useEffect(() => {
    value.fetchNotificationToRead()
  }, [follow, comments, like, view])


  //function for telling user to login to perform any features..
  const checklogin = () => {
    if (value.islogout === true) {
      //alert that he is logout ... please login
      value.setisOK(false);
      value.setmessage("LOG-OUT! please login for further aproach");
    }
  };

  //api calling for fetching folders
  const fetchFolders = async () => {
    setfolders([]);
    let folderpath;
    if (localStorage.getItem("folderPath")) {
      folderpath = localStorage.getItem("folderPath").split(",").join("/");
    } else {
      folderpath = localStorage.getItem("baseFolderPath").split(",").join("/");
    }
    const res = await fetch(`${value.host}/api/folder/fetch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        folderPath: `${folderpath}`,
      }),
    });

    const data = await res.json();
    setnewFolderSwitch(false);
    //make loader invisible and main part visible after fetching data

    Array.from(document.getElementsByClassName("folderDiv")).forEach((item) => {
      item.classList.remove("d-none");
    });
    document.getElementById("loader") ? document.getElementById("loader").classList.add("d-none") : "";
    if (data.error) {
      //if any error occured
      value.setisOK(false);
      value.setmessage(`${data.message}`);

    } else {
      //if all is well
      setfirstCreate(null);
      setisCreated(false);
      setfolders(data.folders);
      setisloaded(true)
    }
  };

  //api calling to fetch all notes of user
  const fetchNotes = async () => {
    setnotes([]);
    let folderpath;
    if (localStorage.getItem("folderPath")) {
      folderpath = localStorage.getItem("folderPath").split(",").join("/");
    } else {
      folderpath = localStorage.getItem("baseFolderPath").split(",").join("/");
    }
    const res = await fetch(`${value.host}/api/notes/fetch`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
        user: `${value.userId}`,
        folderPath: `${folderpath}`,
      },
    });
    const data = await res.json();
    //make loader invisible and main part visible after fetching data
    setnewFolderSwitch(false);

    Array.from(document.getElementsByClassName("noteDiv")).forEach((item) => {
      item.classList.remove("d-none");
    });
    document.getElementById("loader") ? document.getElementById("loader").classList.add("d-none") : ""
    if (!data.error) {
      //if all is well
      try {
        setnotes(data.file);
        setisloaded(true)
      } catch (error) {
        value.setisOK(false);
        value.setmessage(error.message);
      }
    } else {
    }
  };

  //function on clicking select button
  const select = () => {
    if (value.isSelect === true) {
      value.setisSelect(false);
      Array.from(document.getElementsByClassName("checkboxNoLabel")).forEach(
        (item) => {
          item.checked = false;
        }
      );
      setnotesId([]);
      setfolderId([]);
    } else {
      value.setisSelect(true);
    }
  };

  //function to post files and folders
  const createPost = async (aboutId) => {

    if (notesId.length !== 0 || folderId.length !== 0) {
      let folderpath;
      if (localStorage.getItem("folderPath")) {
        folderpath = localStorage.getItem("folderPath").split(",").join("/");
      } else {
        folderpath = localStorage
          .getItem("baseFolderPath")
          .split(",")
          .join("/");
      }

      if (folderId.length !== 0) {
        const res = await fetch(`${value.host}/api/social/post/folder/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: `${value.authtoken}`,
          },
          body: JSON.stringify({
            user: `${value.userId}`,
            id: folderId,
            folderPath: `${folderpath}`,
            aboutId: aboutId
          })
        })
        const data = await res.json()
      }

      //post only files
      if (notesId.length !== 0) {
        try {
          const res = await fetch(`${value.host}/api/social/post/file/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authToken: `${value.authtoken}`,
            },
            body: JSON.stringify({
              user: `${value.userId}`,
              id: notesId,
              folderPath: `${folderpath}`,
              aboutId: aboutId
            }),
          });
          const data = await res.json();

          if (data.error) {
            //if any error occured
            value.setisOK(false);
            value.setmessage(data.message);
          } else {
            setnotesId([]); //set notesid empty
            value.setisOK(true);
            value.setmessage(data.message);
          }

        } catch (error) {
          setisDelete(false);
          setdeleteMessage(error.message);
          value.setisOK(false);
          value.setmessage("Some Error Occured.. Please try again");
        }
      }

      //deselect all the remaining notes after getting data
      value.setisSelect(false);
      Array.from(document.getElementsByClassName("checkboxNoLabel")).forEach(
        (item) => {
          item.checked = false;
        }
      );
    } else {
      value.setisOK(false);
      value.setmessage("Please select first");
    }
  };

  //function to delete notes by its id
  const deleteNoteById = async () => {
    if (notes.length !== 0 || folderId.length !== 0) {
      let folderpath;
      if (localStorage.getItem("folderPath")) {
        folderpath = localStorage.getItem("folderPath").split(",").join("/");
      } else {
        folderpath = localStorage
          .getItem("baseFolderPath")
          .split(",")
          .join("/");
      }
      if (folderId.length !== 0) {
        try {
          const res = await fetch(`${value.host}/api/folder/delete`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authToken: `${value.authtoken}`,
            },
            body: JSON.stringify({
              user: `${value.userId}`,
              folderId: folderId,
              folderPath: `${folderpath}`,
            }),
          });
          const data = await res.json();
          if (data.error) {
            //if any error occured
            setisDelete(false);
            setdeleteMessage(data.message);
            value.setisOK(false);
            value.setmessage(`${data.message}`);
          } else {
            setfolderId([]); //set notesid empty
            setisDelete(true);
            setdeleteMessage(data.message);
            value.setisOK(true);
            value.setmessage(data.message);
          }
        } catch (error) {
          setisDelete(false);
          setdeleteMessage(error.message);
          value.setisOK(false);
          value.setmessage("Some Error Occured.. Please try again");
        }
      }

      if (notesId.length !== 0) {
        try {
          value.setmessage("Processing...Please don't refresh");

          //calling api to delete file notes
          const res = await fetch(`${value.host}/api/notes/delete`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authToken: `${value.authtoken}`,
            },
            body: JSON.stringify({
              user: `${value.userId}`,
              id: notesId,
              folderPath: `${folderpath}`,
            }),
          });
          const data = await res.json();
          if (data.error) {
            //if any error occured
            setisDelete(false);
            setdeleteMessage(data.message);
            value.setisOK(false);
            value.setmessage(`${data.message}`);
          } else {
            //if all is well
            let deleteFile = true; // return value after deleting

            //try to delete notes from firebase
            for (let index = 0; index < data.filename.length; index++) {
              if (data.type[index] !== "text") {
                if (deleteFile !== true) {
                  break;
                }
                deleteFile = await deleteFileFromFirebase(
                  `${value.userId}/${folderpath}/${data.filename[index]}`
                );
              }
            }

            if (deleteFile === true) {
              setnotesId([]); //set notesid empty
              setisDelete(true);
              setdeleteMessage(data.message);
              value.setisOK(true);
              value.setmessage(data.message);
            } else {
              setnotesId([]); //set notesid empty
              setisDelete(false);
              setdeleteMessage(deleteFile);
              value.setisOK(false);
              value.setmessage(deleteFile);
            }
          }
        } catch (error) {
          setisDelete(false);
          setdeleteMessage(error.message);
          value.setisOK(false);
          value.setmessage("Some Error Occured.. Please try again");
        }
      }

      //deselect all the remaining notes after getting data
      value.setisSelect(false);
      Array.from(document.getElementsByClassName("checkboxNoLabel")).forEach(
        (item) => {
          item.checked = false;
        }
      );
    } else {
      value.setisOK(false);
      value.setmessage("Notes are not saved yet");
    }
  };

  useEffect(() => {
    document.getElementsByClassName("emptyNotes")[0].innerHTML = "";
  }, [firstCreate, folders]);

  useEffect(() => {
    if (value.islogout === true) {
      setfolderPathArray([]);
    } else {
      localStorage.setItem("baseFolderPath", folderPathArray);
      if (localStorage.getItem("folderPath")) {
        setfolderPathArray(localStorage.getItem("folderPath").split(","));
      }
    }
  }, [value.isOK]);

  useEffect(() => {
    fetchFolders();
    // fetchNotes();
    value.fetchNotificationToRead()
  }, [isCreated, newFolderSwitch, isDelete]);

  useEffect(() => {
    fetchNotes();
  }, [newFolderSwitch, isDelete])


  useEffect(() => {
    if (value.islogout === true) {
      value.setisOK(false);
      value.setmessage("LOG-OUT! please login for further aproach");
      setnotes([]);
    }
  }, [value.islogout]);

  useEffect(() => {
    if (newFolderSwitch === true) {
      Array.from(document.getElementsByClassName("folderDiv")).forEach(
        (item) => {
          item.classList.add("d-none");
        }
      );
      Array.from(document.getElementsByClassName("noteDiv")).forEach((item) => {
        item.classList.add("d-none");
      });
      document.getElementById("loader").classList.remove("d-none");
    }
  }, [value.isOK]);


  return (

    <div className="mt-3 h-100 position-relative ">

      <ShareModal url={shareurl} seturl={setshareurl} />

      <UploadModal createPost={createPost} setnotesId={setnotesId} setfolderId={setfolderId} />

      <DeleteModal
        deleteNoteById={deleteNoteById}
        setisDelete={setisDelete}
        isDelete={isDelete}
        setdeleteMessage={setdeleteMessage}
        deleteMessage={deleteMessage}
      />

      {/* alert for any change */}
      <Alert
        isdisplay={value.isOK === null ? false : true}
        mode={`${value.isOK === true ? "success" : "warning"}`}
        message={value.message}
      />

      {<div
        className={`mainContent w-100 position-absolute rounded-3 top-0 pt-4 ${notes.length !== 0 && folders.length !== 0 ? 'd-none' : ''}`}
        style={{ backgroundColor: "#1f1f2ab8" }}
      >
        {/* headers and options */}
        <div
          className="headersAndOptions d-md-flex align-items-center py-3 w-100 "
          role="group"
          aria-label="Basic example"
        >
          <div className="textBtn d-flex flex-wrap align-items-center">

            {/* add notes button  */}
            <button
              type="button"
              className="fileControls rounded-3 mx-3 mb-3"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
             <span className=" position-relative z-1">Add Notes</span> 
            </button>
            <ul className="dropdown-menu text-white" style={{ minWidth: "100px" ,background: "#3d3a4e" }}>
              <Link
                className="dropdown-item text-white"
                to={`${value.islogout === false ? "/addNoteForm" : ""}`}
                onClick={(e) => {
                  checklogin();
                }}
                onMouseOver={(e)=>{e.currentTarget.style.backgroundColor = "#2e2b3c"}}
                onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor = "#3d3a4e"}}
                style={{transition:"all 500ms ease"}}
              >
                <li>Text</li>
              </Link>

              <Link
                className="dropdown-item text-white"
                to={`${value.islogout === false ? "/uploadFileForm" : ""}`}
                onClick={(e) => {
                  checklogin();
                }}
                onMouseOver={(e)=>{e.currentTarget.style.backgroundColor = "#2e2b3c"}}
                onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor = "#3d3a4e"}}
                style={{transition:"all 500ms ease"}}
              >
                <li>File</li>
              </Link>
            </ul>

            {/* create folder button  */}
            <button
              type="button"
              className="fileControls rounded-3 mx-3 mb-3"
              onClick={(e) => {
                checklogin();
                if (value.islogout === false) {
                  firstCreate === null
                    ? setfirstCreate(true)
                    : setfirstCreate(null);
                }
              }}
            >
             <span className=" position-relative z-1"> Folder <i className="fa-solid fa-folder-plus"></i></span>
            </button>

            {/* upload files and folders button  */}
            <button
              type="button"
              className="fileControls rounded-3 mx-3 mb-3"
              data-bs-toggle={`${(folderId.length !== 0 || notesId.length !== 0) &&
                value.isOK !== false
                ? "modal"
                : ""
                }`}
              data-bs-target={`${(folderId.length !== 0 || notesId.length !== 0) &&
                value.isOK !== false
                ? "#exampleModal2"
                : ""
                }`}
              onClick={(e) => {
                checklogin();
                if (
                  notes.length === 0 &&
                  value.islogout === false &&
                  folders.length === 0
                ) {
                  value.setisOK(false);
                  value.setmessage(
                    "You donot have any notes ... please add notes"
                  );
                } else if (
                  notesId.length === 0 &&
                  value.islogout === false &&
                  folderId.length == 0
                ) {
                  value.setisOK(false);
                  value.setmessage("Please Select First");
                }
              }}
            >
            <span className=" position-relative z-1">Post <i className="fa-solid fa-cloud-arrow-up"></i></span>  
            </button>

            {/* select button  */}
            <button
              type="button"
              className="fileControls rounded-3 mx-3 mb-3"
              onClick={() => {
                value.islogout === true ? checklogin() : "";
                //inform user to add notes when he is logged in;
                if (
                  notes.length === 0 &&
                  value.islogout === false &&
                  folders.length === 0
                ) {
                  value.setisOK(false);
                  value.setmessage(
                    "You donot have any notes ... please add notes"
                  );
                }
                (folders.length !== 0 || notes.length !== 0) &&
                  value.islogout === false
                  ? select()
                  : "";
              }}
            >
             <span className=" position-relative z-1"> Select</span>
            </button>

            {/* btn icons  */}
            <div className="iconBtn mb-3 ">

              {/* share button  */}
              <button
                data-bs-toggle="modal" data-bs-target="#exampleModalshare"
                type="button"
                className=" rounded-3 mx-3 pt-2"
                style={{
                  border: "none",
                  outlineColor: "transparent",
                  backgroundColor: "transparent",
                }}
                onClick={(e) => {
                  e.preventDefault()
                  setshareurl(`https://notebridge2005.netlify.app/your/files/${value.userId}`)
                }}
              >
                <i
                  className="fa-solid fa-share-nodes"
                  style={{ fontSize: "26px" , color:'white' }}
                ></i>
              </button>

              {/* delete button  */}
              <button
                type="button"
                id="deletebutton"
                className="rounded-3 mx-3"
                data-bs-toggle={`${(folderId.length !== 0 || notesId.length !== 0) &&
                  value.isOK !== false
                  ? "modal"
                  : ""
                  }`}
                data-bs-target={`${(folderId.length !== 0 || notesId.length !== 0) &&
                  value.isOK !== false
                  ? "#exampleModal1"
                  : ""
                  }`}
                style={{
                  border: "none",
                  outlineColor: "transparent",
                  backgroundColor: "transparent",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  value.islogout === true ? checklogin() : "";
                  //inform user to add notes when he is logged in;
                  if (
                    notes.length === 0 &&
                    value.islogout === false &&
                    folders.length === 0
                  ) {
                    value.setisOK(false);
                    value.setmessage(
                      "You donot have any notes ... please add notes"
                    );
                  } else if (
                    notesId.length === 0 &&
                    value.islogout === false &&
                    folderId.length == 0
                  ) {
                    value.setisOK(false);
                    value.setmessage("Please Select First");
                  }
                }}
              >
                <i className="fa-solid fa-trash" style={{ fontSize: "23px", color:'white' }}></i>
              </button>

            </div>

          </div>

        </div>

        <div className="path d-flex align-items-center w-auto px-3 overflow-auto">
          {folderPathArray.map((item) => {
            return (
              <FolderPath
                setnewFolderSwitch={setnewFolderSwitch}
                key={uuid()}
                path={item == "MainSection" ? item : `/ ${item}`}
                changeFolder={changeFolder}
                setchangeFolder={setchangeFolder}
              />
            );
          })}
        </div>

        {/* loder upto isloaded is false  */}
        {(notes.length === 0 && folders.length === 0) && isloaded!==true && <PageLoader />}

        <div
          className={`w-auto px-3 mainSection d-flex flex-wrap justify-content-center py-3 `}
          id="mainSection"
        >
          {/* area for showing folders  */}

          <CreateFolder
            tempFolderName={tempFolderName}
            firstCreate={firstCreate}
            settempFolderName={settempFolderName}
            isCreated={isCreated}
            setisCreated={setisCreated}
          />

          {folders.map((item) => {
            return (
              <Folder
                setnewFolderSwitch={setnewFolderSwitch}
                setchangeFolder={setchangeFolder}
                key={item._id}
                isItem={`${value.islogout === false ? true : false}`}
                isCreated={isCreated}
                setisCreated={setisCreated}
                name={item.name}
                cardId={item._id}
                folderId={folderId}
                setfolderId={setfolderId}
              />
            );
          })}

          {notes.map((file) => {

            return (
              <NoteCard
                key={file._id}
                cardId={file._id}
                extention={file.extention}
                name={file.originalname}
                setnotesId={setnotesId}
                notesId={notesId}
                url={file.url}
                desc={file.desc}
              />
            );
          })}

          <div className="conatiner text-center " id="emptyNotes">
            <p className=" h3 emptyNotes fw-bold text-center"></p>
          </div>
        </div>

      </div>}

    </div>
  );
};

export default UserNotes;
