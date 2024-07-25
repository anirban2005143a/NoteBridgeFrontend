import React, { useContext, useState, useEffect } from "react";
import "../../css/notification.css";
import NoteContext from "../../context/notes/noteContext";
import defaultUserImg from "../../assets/defaultUserImg.png";
import postImg from "../../assets/postImg.jpg";
import io from "socket.io-client";
import RotatingBorder from "../rotatingBorder";
import { v4 as uuid } from "uuid";
import ContentLoader from "react-content-loader";
import { Link } from "react-router-dom";

const notifications = () => {
  const value = useContext(NoteContext);
  const socket = io(`${value.host}`);

  const [allNotification, setallNotification] = useState([]);
  const [tempNotification, settempNotification] = useState([]);
  const [tempdata, settempdata] = useState({});
  const [deleteSocket, setdeleteSocket] = useState([]);
  const [tempDelete, settempDelete] = useState([]);
  const [isLoaded, setisLoaded] = useState(false)
   useEffect(() => {
    socket.emit("userConnected", `${value.userId}`); //connect to io
    //socket reply of followReqStatus
    socket.on("followReqStatus", (data) => {
       settempdata(data);
    });
    //socket reply of followReqStatus
    socket.on("UserpostComment", (data) => {
       settempdata(data);
    });
    //socket reply of view request status
    socket.on("viewReq", (data) => {
       settempdata(data);
    });
    //socket reply for likes
    socket.on("postLike", (data) => {
       settempdata(data);
      // value.fetchNotificationToRead()
    });
    //socket reply for deleting
    //for like
    socket.on("deleteLike", (data) => {
      settempDelete(data);
    });
    //for follow request
    socket.on("deletefollowReq", (data) => {
      settempDelete(data);
    });
    //for view request
    socket.on("deleteviewReq", (data) => {
      settempDelete(data);
    });
  }, []);

  //function to fetch all notififcation
  const fetchNotification = async () => {
    const res = await fetch(`${value.host}/api/notification/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
      }),
    });
    const data = await res.json();
    const Arr = data.allNotification.flat();
    //sort notification array according to date old to new
    Arr.sort(
      (a, b) => new Date(b.notification.date) - new Date(a.notification.date)
    );
    setallNotification(Arr);
    setisLoaded(true)
  };

  //function to accept request
  const acceptReq = async (follwerId, aboutId, reqType, parentNode, reqId) => {
    const res = await fetch(`${value.host}/api/notification/accept/req`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        followerId: follwerId,
        aboutId: aboutId,
        reqType: reqType,
        reqId: reqId
      }),
    });
    const data = await res.json();
     if (data.error) {
    } else {
      parentNode.querySelectorAll("button")[0].innerHTML = "Accepted";
      parentNode.querySelectorAll("button")[0].style.backgroundColor = "green";
      parentNode.querySelectorAll("button")[0].style.color = "white";
      parentNode.querySelectorAll("button")[0].disabled = true
      parentNode.querySelectorAll("button")[1].classList.add("d-none")
      //send data to socket
      socket.emit("acceptReq", {
        reqAccept: data.reqAccept,
        followerId: follwerId,
        followingId: value.userId,
      });
    }
  };

  //function to deny request
  const denyReq = async (follwerId, aboutId, reqType, parentNode, reqId) => {
    const res = await fetch(`${value.host}/api/notification/deny/req`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        followerId: follwerId,
        aboutId: aboutId,
        reqType: reqType,
        reqId: reqId
      }),
    })
    const data = await res.json()
     if (data.error) {

    } else {
      parentNode.querySelectorAll("button")[1].innerHTML = "Denied";
      parentNode.querySelectorAll("button")[1].style.backgroundColor = "red";
      parentNode.querySelectorAll("button")[1].disabled = true
      parentNode.querySelectorAll("button")[0].classList.add("d-none")
      //send to io
      socket.emit("denyReq", {
        reqDenied: data.reqDenied,
        followerId: follwerId,
        followingId: value.userId,
      });
    }
  }

  useEffect(() => {
    fetchNotification();
    value.fetchNotificationToRead()
  }, [tempNotification, deleteSocket]);

  useEffect(() => {
    Object.keys(tempdata).length !== 0
      ? localStorage.setItem("tempdata", JSON.stringify(tempdata))
      : "";
    if (localStorage.getItem("tempdata")) {
      const obj = JSON.parse(localStorage.getItem("tempdata"));
      settempNotification([obj, ...tempNotification]);
      setdeleteSocket([]);
    }
  }, [tempdata]);

  useEffect(() => {
    Object.keys(tempDelete).length !== 0
      ? localStorage.setItem("tempDelete", JSON.stringify(tempDelete))
      : "";
    if (localStorage.getItem("tempDelete")) {
      const obj = JSON.parse(localStorage.getItem("tempDelete"));
      setdeleteSocket([obj, ...deleteSocket]);
    }
  }, [tempDelete]);

  useEffect(() => {
    const filterdarr = tempNotification.filter((notification) => {
      let status = true;
      for (let index = 0; index < deleteSocket.length; index++) {
        deleteSocket[index].id === notification.notification._id
          ? (status = false)
          : "";
      }
       return status;
    });
    settempNotification(filterdarr);

    //filter all notifications
    const arr = allNotification.filter((item) => {
      let status = true;
      for (let index = 0; index < deleteSocket.length; index++) {
        if (deleteSocket[index].id === item.notification._id) {
          status = false;
        }
      }
      return status;
    });
    setallNotification(arr)
  }, [deleteSocket]);

  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("tempdata");
    localStorage.removeItem("tempDelete");
  });

  return (
    <div className="container my-4">
      <div className={`${isLoaded === true ? "d-none" : ""} contentLoader d-flex justify-content-center mt-5 pt-5`}>
        <ContentLoader
          speed={2}
          width={400}
          height={150}
          viewBox="0 0 400 150"
          backgroundColor="#8593ff"
          foregroundColor="#616bff"

        >
          <circle cx="71" cy="17" r="8" />
          <rect x="94" y="12" rx="5" ry="5" width="220" height="10" />
          <circle cx="72" cy="49" r="8" />
          <rect x="96" y="45" rx="5" ry="5" width="220" height="10" />
          <circle cx="72" cy="82" r="8" />
          <rect x="95" y="77" rx="5" ry="5" width="220" height="10" />
          <circle cx="72" cy="116" r="8" />
          <rect x="95" y="112" rx="5" ry="5" width="220" height="10" />
        </ContentLoader>
      </div>
      <div
        className={`${(allNotification.length === 0 && tempNotification.length === 0) && isLoaded === true
          ? ""
          : "d-none"
          }`}
        style={{ marginTop: "10%" }}
      >
        <RotatingBorder message="You do not have any notification" />
      </div>
      <div className="row">
        <div className="col-lg-9 right mx-auto " style={{ padding: 0 }}>
          <div className="box rounded bg-white mb-3">
            <div className="box-body p-0">
              <div
                key={Math.random() * 10000}
                className=" p-sm-3 p-2 border-bottom osahan-post-header"
              >


                {/* notifications after refresh  */}
                {allNotification.map((notification) => {
                  let isShow = false;
                  if (notification.notification.isLiked) {
                    notification.notification.isLiked === true
                      ? (isShow = true)
                      : "";
                  }
                  notification.notification.isreq ? isShow = true : ""
                  notification.notification.comment ? (isShow = true) : "";
                   if (
                    isShow === true 
                  ) {
                    return (
                      <div
                        key={notification._id}
                        className=" mb-3 justify-content-center notification sm-notification d-flex position-relative"
                        style={{
                          boxShadow: "0 0 15px blue",
                        }}
                      >
                        {/* prifile img  */}
                        <div className="profileImg position-absolute start-0 mx-3 ">
                          <div
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `/social/profile/${notification.user._id}`
                            }}
                            className="img overflow-hidden rounded-circle object-fit-cover "
                            style={{
                              width: "35px",
                              height: "35px",
                              cursor: "pointer",
                            }}
                          >
                            {/* <a href={`/social/profile/${notification.user._id}`}> */}
                            <img
                              src={
                                notification.user.profileimg === "undefined"
                                  ? defaultUserImg
                                  : notification.user.profileimg
                              }
                              className=" w-100 h-100 object-fit-cover"
                            />
                            {/* </a> */}

                          </div>
                        </div>
                        {/* notification message  */}
                        <div
                          className="content position-absolute "
                          style={{ left: "60px" }}
                        >
                          <div className="userName fw-medium sm-small  ">{`${notification.user.firstName} ${notification.user.lastName}`}</div>
                          <div className="userName fw-light  sm-small ">
                            {`${notification.message}`}
                            <Link to={`/post/${notification.notification.aboutId}`}>
                              <span onClick={(e) => {
                                value.seturlPath(`/post/${notification.notification.aboutId}`)
                              }} className={`${notification.notification.type ==="view" ? "" : "d-none"} mx-2`} >
                                <img src={postImg} style={{ border: "1px solid black", width: "25px", height: "25px", cursor: "pointer" }} />
                              </span>
                            </Link>
                          </div>
                        </div>
                        {/* btn group  */}
                        <div
                          className={`${notification.notification.isreq ? "" : "d-none"
                            } me-2 sm-btngroup position-absolute end-0 buttons d-flex align-items-center justify-content-center `}
                        >
                          {/* accept btn  */}
                          <button
                            type="button"
                            className={`btn mx-1 sm-small btn-primary ${notification.notification.isRejected === true ? "d-none" : ""}`}
                            style={{ backgroundColor: `${notification.notification.isaccept === true ? "rgb(89 202 65)" : ""}`, color: `${notification.notification.isaccept === true ? "white" : ""}` }}
                            onClick={(e) => {
                              e.preventDefault();
                              if (notification.notification.isaccept === false) {
                                 e.target.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
                                let followerId;
                                notification.notification.type === "view"
                                  ? (followerId = notification.notification.user)
                                  : "";
                                notification.notification.type === "follow"
                                  ? (followerId =
                                    notification.notification.followerId)
                                  : "";
                                 
                                acceptReq(
                                  followerId,
                                  notification.notification.aboutId,
                                  notification.notification.type,
                                  e.currentTarget.parentNode, notification.notification._id
                                );
                              }

                            }}
                          >
                            {`${notification.notification.isaccept === true ? "Accepted" : "Accept"}`}
                          </button>
                          {/* deny btn  */}
                          <button type="button"
                            className={`mx-1 sm-small btn btn-danger ${notification.notification.isaccept === true ? "d-none" : ""}`}
                            onClick={(e) => {
                              e.preventDefault()
                              if (notification.notification.isRejected === false) {
                                 e.target.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
                                let followerId;
                                notification.notification.type === "view"
                                  ? (followerId = notification.notification.user)
                                  : "";
                                notification.notification.type === "follow"
                                  ? (followerId =
                                    notification.notification.followerId)
                                  : "";
                                
                                denyReq(followerId,
                                  notification.notification.aboutId,
                                  notification.notification.type,
                                  e.currentTarget.parentNode, notification.notification._id)
                              }
                            }}>
                            {`${notification.notification.isRejected === true ? "Denied" : "Deny"}`}
                          </button>
                        </div>
                        {/* post img  */}
                        <div
                          className={`${notification.notification.isreq ? "d-none" : ""
                            } me-2 position-absolute end-0  postImg overflow-hidden object-fit-cover`}
                          style={{
                            width: "50px",
                            height: "50px",
                            border: "2px solid black",
                            cursor: "pointer",
                          }}
                        ><Link to={`/post/${notification.notification.aboutId}`}>
                            <img onClick={(e)=>{
                              value.seturlPath(`/post/${notification.notification.aboutId}`)
                            }} src={postImg} className=" w-100 h-100 " />
                          </Link>
                        </div>

                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default notifications;
