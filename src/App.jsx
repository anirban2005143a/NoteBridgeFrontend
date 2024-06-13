import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import UserNotes from "./components/userNotes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NoteContext from "./context/notes/noteContext";
import LoginForm from "./components/inputForms/loginForm";
import SignupForm from "./components/inputForms/signupForm";
import Addnotes from "./components/inputForms/addNotes";
import UserDetails from "./components/userDetails";
import FileUpload from "./components/inputForms/fileUpload";
import Img from "./assets/defaultUserImg.png";
import SideNavbar from "./components/SideNavbar";
import UserProfile from "./components/social/userProfile";
import Post from "./components/social/post";
import "./css/global.css";
import Notifications from "./components/social/notifications"
import About from "./components/about";

function App() {


  const [isSelect, setisSelect] = useState(false); //for select anything
  const [islogout, setislogout] = useState(false); //for check logout of not
  const [userImg, setuserImg] = useState(Img); //for default user image
  //states for alert component props
  const [isOK, setisOK] = useState(null);
  const [message, setmessage] = useState("");

  const [aboutPost, setaboutPost] = useState([])

  const host = import.meta.env.VITE_REACT_HOST;
  const authtoken = localStorage.getItem("authtoken");
  const userId = localStorage.getItem("userId");
  const [unReadNotificationLength, setunReadNotificationLength] = useState(0)
  const [urlPath, seturlPath] = useState("")

  //function to fetch all notififcation
  const fetchNotificationToRead = async () => {
    if (islogout === false) {
      const res = await fetch(`${host}/api/notification/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: authtoken,
        },
        body: JSON.stringify({
          user: userId,
        }),
      });
      const data = await res.json();
      if (data.allNotification) {
        const Arr = data.allNotification.flat();
         const total = Arr.length
        let seen = 0
        if (localStorage.getItem("seen")) {
          seen = localStorage.getItem("seen")
           localStorage.setItem("seen", total)
        } else { localStorage.setItem("seen", total) }
        const unseen = total - seen
   
        setunReadNotificationLength(unseen)
        if (unseen > 0) {
           localStorage.setItem("unseen", true)
        }
      }
    }
  };


  //set islogout id there is any authtoken and userid both peresent
  useEffect(() => {
    if (authtoken === null || userId === null) {
      setislogout(true);
    }
  }, []);

  //set isok to null after giving it any value after 2 sec
  useEffect(() => {
    setTimeout(() => {
      setisOK(null);
      setmessage("");
    }, 2000);
  }, [isOK]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>
            <SideNavbar />
            <div className=" w-100 overflow-auto">

              <Post />
            </div>
          </div>
        </>
      ),
    },
    {
      path: "/post/:id",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>
            <SideNavbar />
            <div className=" w-100 overflow-auto">

              <Post />
            </div>
          </div>
        </>
      ),
    },
    {
      path: "/your/files",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>
            <SideNavbar />
            <div className=" w-100 overflow-auto">

              <UserNotes />
            </div>
          </div>
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>

            <SideNavbar />
            <div className=" w-100 overflow-auto">
              <About />
            </div>
          </div>
        </>
      ),
    },
    {
      path: "/addNoteForm",
      element: <Addnotes />,
    },
    {
      path: "/uploadFileForm",
      element: <FileUpload />,
    },
    {
      path: "/user/logIn",
      element: <LoginForm />,
    },
    {
      path: "/user/signup",
      element: <SignupForm />,
    },
    {
      path: "/user/account",
      element: (
        <>
          <div className="background">
            <UserDetails />
          </div>
        </>
      ),
    },
    {
      path: "/social/notifications",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>
            <SideNavbar />
            <div className=" w-100 overflow-auto">
              <Notifications />
            </div>
          </div>
        </>
      ),
    },
    {
      path: "/social/profile/:id",
      element: (
        <>
          <div className=" d-flex overflow-hidden" style={{ height: "100vh" }}>
            <SideNavbar />
            <div className=" w-100 overflow-auto">
              <UserProfile />
            </div>
          </div>
        </>
      ),
    },
  ]);

  return (
    <>
      <NoteContext.Provider
        value={{
          isOK, aboutPost, setaboutPost, fetchNotificationToRead, unReadNotificationLength, setunReadNotificationLength,
          setisOK, urlPath, seturlPath,
          message,
          setmessage,
          userImg,
          islogout,
          setislogout,
          setisSelect,
          isSelect,
          host,
          authtoken,
          userId,
        }}
      >
        <RouterProvider router={router} />
      </NoteContext.Provider>
    </>
  );
}

export default App;
