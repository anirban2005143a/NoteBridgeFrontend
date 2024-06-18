import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NoteContext from "../context/notes/noteContext";
import { logout } from "../functions/logout";
import defaultUserImg from "../assets/defaultUserImg.png";
import NotificationBadge from "./notificationBadge";
import AlertSound from "../assets/notification.mp3"

const home = () => {
  const location = useLocation();
  const value = useContext(NoteContext);
  const [originalUser, setoriginalUser] = useState(null); //state for original user details
  const [unseen, setunseen] = useState(false)
  const [profilePath, setprofilePath] = useState(`/social/profile/${value.userId}`)

  //function to save original user details
  const getOriUser = async () => {
    const res = await fetch(`${value.host}/api/auth/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        userId: `${value.userId}`
      }),
    });
    const data = await res.json();
     if (data.error) {
      value.setisOK(false)
      value.setmessage(data.message)
    } else {
      setoriginalUser(data.user);
    }
  };

  useEffect(() => {
    getOriUser()
  }, [])
  
  useEffect(() => {
    if(localStorage.getItem("unseen")){
      localStorage.getItem("unseen")==="true" ? setunseen(true): ""
    }
    if(location.pathname === "/social/notifications"){
      setunseen(false)
      localStorage.setItem("unseen" , false)
    }
  }, [value.unReadNotificationLength])
  

  useEffect(() => {
    if(unseen === true && value.unReadNotificationLength > 0 ){
      document.querySelector("audio").play()
    }
    
  }, [unseen , value.unReadNotificationLength])
  

  return (
    <div className=" sideNavbar px-2 bg-primary ">
      <div className="d-flex flex-column align-items-center align-items-sm-start  pt-2 text-white min-vh-100">
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start fs-5"
          id="menu"
        >

          <Link to="/" className="nav-link align-middle px-0">
            <li
              className="nav-item  text-white   "
              style={{ cursor: "pointer" }}
              onClick={(e)=>{
                value.seturlPath("/")
              }}
            >
              <i className={`fa-solid fa-house-user  ${location.pathname == "/" ? "fw-bold active" : ""
                  }`}></i>
              <span
                className={`ms-1 d-none d-sm-inline ${location.pathname == "/" ? "fw-bold active" : ""
                  }`}
              >
                Home
              </span>
            </li>
          </Link>

          <Link className=" text-white text-decoration-none" to="/about">
            <li
              className=" text-white nav-link px-0 align-middle"
              style={{ cursor: "pointer" }}
            >
              <i className={`fa-solid fa-circle-info ${location.pathname == "/about" ? "fw-bold active" : ""
                  }`}></i>
              <span
                className={`ms-1 d-none d-sm-inline text-decoration-none ${location.pathname == "/about" ? "fw-bold active" : ""
                  }`}
              >
                About Us
              </span>
            </li>
          </Link>

          <Link to={`${value.islogout === false ? `/your/files/${value.userId}` : ""}`}>
            <li

              data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
              data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}
              className=" text-white nav-link px-0 align-middle"
              style={{ cursor: "pointer" }}
            >
              <i className={`fa-solid fa-file ${location.pathname.includes("your/files") ? "fw-bold active" : ""}`}></i>
              <span
                className={`ms-1 d-none d-sm-inline ${location.pathname.includes("your/files") ? "fw-bold active" : ""
                  }`}
              >
                &nbsp;Your Files
              </span>
            </li>
          </Link>

          <Link to={`${value.islogout === false ? "/social/notifications" : ""}`}>
            <li
              className=" position-relative text-white nav-link px-0 align-middle"
              data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
              data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}
              style={{ cursor: "pointer" }}

            ><audio src={AlertSound}></audio>
              <i
                className={`fa-solid fa-bell position-relative ${location.pathname === "/social/notifications" ? "fw-bold active" : "" }`}
              // style={{ color: "#0020ff", cursor: "pointer" }}
              > <div className={`${location.pathname === "/social/notifications" ? "d-none" : ""} ${unseen === true && value.unReadNotificationLength > 0 ? "" : "d-none" }`} ><NotificationBadge /></div>
              </i>
              <span className={`ms-1 d-none d-sm-inline ${location.pathname === "/social/notifications" ? "fw-bold active" : "" }`}>
                &nbsp;Notification
              </span>
            </li>
          </Link>
        </ul>
        <hr />
        <div className="dropdown pb-4">
          <a
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ cursor: "pointer" }}
          >
            <img
              src={originalUser ? value.islogout === true || originalUser.profileimg === "undefined" ? defaultUserImg : originalUser.profileimg : defaultUserImg}
              alt="hugenerd"
              width="30"
              height="30"
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
            <span className="d-none d-sm-inline mx-1">User</span>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li style={{ cursor: "pointer" }}>
              <Link className="dropdown-item" to="/user/logIn">
                Log in
              </Link>
            </li>
            <li style={{ cursor: "pointer" }} className={`${value.islogout === true ? "d-none" : ""}`}>
              <a
                className="dropdown-item "
                href={profilePath}
                onClick={() => {
                  value.islogout === true ? value.setisOK(false) : "";
                  value.islogout === true
                    ? value.setmessage(
                      "LOG-OUT! please login for further aproach"
                    )
                    : "";
                }}
              >
                Profile
              </a>
            </li>
            <li style={{ cursor: "pointer" }}>
              <hr className="dropdown-divider" />
            </li>
            <li className={`${value.islogout === true ? "d-none" : ""}`}>
              <Link
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                  value.setislogout(true); //make sure he is loged out
                  window.location.href = "/"
                }}
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default home;
