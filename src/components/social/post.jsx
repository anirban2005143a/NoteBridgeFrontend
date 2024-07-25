import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import NoteContext from "../../context/notes/noteContext";
import { v4 as uuid } from "uuid";
import postBackground from "../../assets/postBackground.jpg";
import { FileIcon, defaultStyles } from "react-file-icon";
import defaultUserImg from "../../assets/defaultUserImg.png";
import "../../css/glowBtn.css";
import io from "socket.io-client";
import RotatingBorder from "../rotatingBorder";
import LoginModal from "../modals/loginModal";
import Navbar from "../navbar";
import CardLoading from "../cardLoading";
import { showFiles } from "../../functions/showFiles";
import ContentLoader from "react-content-loader"
import ShareModal from "../modals/shareModal";


const post = () => {

  const location = useLocation();
  const { id } = useParams();
  const value = useContext(NoteContext);
  const socket = io(`${value.host}`);

  const [reqStatus, setreqStatus] = useState([])
  const [comments, setcomments] = useState([])
  const [isConnected, setisConnected] = useState(null)
  const [message, setmessage] = useState("Please Wait a While")
  const [like, setlike] = useState(false)
  const [view, setview] = useState(false)
  const [follow, setfollow] = useState(false)

  useEffect(() => {
    socket.emit("userConnected", `${value.userId}`); //connect to io

    //check connected or not 
    socket.on("userConnected", (data) => {
      data.id ? setisConnected(true) : setisConnected(false)
    })
    //socket reply of followReqStatus
    socket.on("postComment", (data) => {
      setcomments(data)
    });

    //get accept req status
    socket.on("acceptReq", (data) => {
      setreqStatus([...reqStatus, data]);
      setfollow(!follow);
    });

    //get accept req status
    socket.on("denyReq", (data) => {
      setreqStatus([...reqStatus, data]);
      setfollow(!follow);
    });

    //socket reply for likes
    socket.on("postLike", (data) => {
      setlike(!like)
    });
    //for like
    socket.on("deleteLike", (data) => {
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
    if (isConnected === false) {
      setmessage("You are to connected , Please refrash once")
    }
  }, [isConnected])


  //function to get file icon image according to their extentions
  const FileIconComponent = ({ extention }) => {
    return <FileIcon extension={extention} {...defaultStyles[extention]} />;
  };

  const [notes, setnotes] = useState([]); //state to save all notes in a array

  const [folderPath, setfolderPath] = useState([]); //state for folder path
  const [about, setabout] = useState([]); //state for about of post
  const [user, setuser] = useState([]); //state for user those have posted
  const [originalUser, setoriginalUser] = useState(null); //state for original user details
  // const [ischanged, setischanged] = useState(null); //state for any change like , comment and share
  const [allLikes, setallLikes] = useState([]);

  const [allFollow, setallFollow] = useState([]);
  const [allComment, setallComment] = useState([]);
  const [allViewReq, setallViewReq] = useState([]);
  const [commentUser, setcommentUser] = useState([]);
  const [isDisplay, setisDisplay] = useState(true)
  const [isLoaded, setisLoaded] = useState(false)
  const [aboutLike, setaboutLike] = useState([])
  const [shareUrl, setshareUrl] = useState(null)
  //fetch all users info those have posted
  const fetchUser = async (userid) => {
    const res = await fetch(`${value.host}/api/social/post/user/fetch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        id: userid,
      }),
    });
    const data = await res.json();
    if (data.error) {

    } else {
      const userArr = data.users;
      userArr.reverse();
      return userArr;
    }

  };

  //fetch all comments of every posts
  const fetchAllComment = async () => {
    if (about.length !== 0) {
      let aboutId = [];
      for (let index = 0; index < about.length; index++) {
        aboutId.push(about[index]._id);
      }

      const res = await fetch(`${value.host}/api/social/post/comment/get`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
        }),
      });

      const data = await res.json();
      if (data.error) {

      } else {
        setallComment(data.allComments);
        let allUsers = [];
        for (let index = 0; index < data.allComments.length; index++) {
          let Ids = [];
          for (let i = 0; i < data.allComments[index].length; i++) {
            Ids.push(data.allComments[index][i].user);
          }
          Ids.reverse();
          const users = await fetchUser(Ids);
          allUsers.push(users);
        }
        setcommentUser(allUsers);
      }

    }
  };

  //fetch all followings of the original user
  const fetchAllFollow = async () => {
    const res = await fetch(`${value.host}/api/social/post/follow/get`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
      }),
    });
    const data = await res.json();
    if (data.error) {

    } else {
      setallFollow(data.allFollow);
    }
  };

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

    } else {
      setoriginalUser(data.user);
    }

  };

  //fetch all about of posted content
  const fetchAbout = async () => {
    const res = await fetch(`${value.host}/api/social/post/about/fetch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
      }),
    });
    const data = await res.json();
    if (data.error) {

    } else {
      let userid = [];
      for (let index = 0; index < data.about.length; index++) {
        userid.push(data.about[index].user);
      }
      const users = await fetchUser(userid);
      setuser(users);
      const aboutArr = data.about;
      aboutArr.reverse();
      setabout(aboutArr);
      setisLoaded(true)
    }

  };

  //function to fetch files
  const fetchFile = async () => {
    let aboutId = [];
    for (let index = 0; index < about.length; index++) {
      aboutId.push(about[index]._id);
    }
    const res = await fetch(`${value.host}/api/social/post/fetch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        aboutId: aboutId,
      }),
    });
    const data = await res.json();
    if (data.error) {

    } else {
      //set files and folders
      setnotes(data.allfiles);

      //set folderPath
      let folderPathArr = [];
      for (let index = 0; index < data.allfiles.length; index++) {
        let pathArr = [];
        for (let i = 0; i < data.allfiles[index].length; i++) {
          let isexist = false;
          for (let ind = 0; ind <= i - 1; ind++) {
            if (pathArr[ind] === data.allfiles[index][i].folderPath) {
              isexist = true;
            }
          }
          if (isexist === false) {
            const arr = data.allfiles[index][i].folderPath;
            pathArr.push(arr);
          }
        }
        folderPathArr.push(pathArr);
      }
      setfolderPath(folderPathArr);
    }


  };

  //function to follow someone
  const handelFollow = async (aboutId, userId, btnArr, status) => {
    if (btnArr.getElementsByClassName("followed")[0].classList.contains("d-none")) {

      //api calling to save follow request
      const res = await fetch(`${value.host}/api/social/post/follow/req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
          isreq: status,
          userId: userId
        }),
      });
      const data = await res.json();
      if (data.error) {

      } else {
        //send req to socket
        if (status === true) {
          socket.emit("followReq", {
            followingId: data.newReq.followingId,
            id: data.newReq._id,
            userId: value.userId,
          });
        } else {
          socket.emit("deletefollowReq", {
            followingId: userId,
            userId: value.userId,
            id: data.id,
          });
        }
      }

    }
    await fetchAllFollow();
  };

  //function to handel like
  const handellike = async (aboutId, userId) => {
    let heartArr = [];
    const elementArr = Array.from(document.getElementsByClassName("fa-heart"));
    for (let index = 0; index < elementArr.length; index++) {
      if (elementArr[index].getAttribute("name") === aboutId) {
        heartArr.push(elementArr[index]);
      }
    }

    if (heartArr[0].classList.contains("d-none") === true) {
      heartArr[1].classList.add("d-none");
      heartArr[0].classList.remove("d-none");
      //api calling for submit like
      const res = await fetch(`${value.host}/api/social/post/like/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
          isLiked: true,
          userId: userId,
        }),
      });
      const data = await res.json();

      if (data.error) {
      } else {//socket to send likes
        socket.emit("postLike", {
          newLike: data.newLike,
          userId: value.userId,
          userAboutId: userId,
        });
        //if all is well
        heartArr[1].classList.add("d-none");
        heartArr[0].classList.remove("d-none");
        aboutLikefunc()
      }
    } else {
      heartArr[1].classList.remove("d-none");
      heartArr[0].classList.add("d-none");

      //api calling for submit like
      const res = await fetch(`${value.host}/api/social/post/like/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
          isLiked: false,
          userId: userId,
        }),
      });
      const data = await res.json();

      if (data.error) {
      } else {//socket to send likes
        socket.emit("deleteLike", {
          userId: value.userId,
          userAboutId: userId,
          id: data.id,
        });
        heartArr[1].classList.remove("d-none");
        heartArr[0].classList.add("d-none");
        aboutLikefunc()
      }
    }
  };

  //function to handel comment
  const handelComment = async (aboutId, i) => {
    let commentArr;
    const elementArr = Array.from(document.getElementsByClassName("comments"));

    for (let index = 0; index < elementArr.length; index++) {
      if (elementArr[index].getAttribute("name") === aboutId) {
        commentArr = elementArr[index];
      }
    }

    if (commentArr.classList.contains("d-none")) {
      commentArr.classList.remove("d-none");
    } else {
      document.getElementsByClassName("commentInput")[i].value = "";
      commentArr.classList.add("d-none");
    }
  };

  //function to submit comments
  const submitCom = async (aboutId, inputValue, userAboutId) => {
    const res = await fetch(`${value.host}/api/social/post/comment/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
        comment: inputValue,
        aboutId: aboutId,
        userId: userAboutId,
      }),
    });
    const data = await res.json();

    //socket to comments using socket
    socket.emit("postComment", {
      newComment: data.newComment,
      userId: value.userId,
      userAboutId: userAboutId,
    });
  };

  //function to handel view request
  const handelViewReq = async (aboutId, userId) => {
    const reqArr = [];
    const reqBtnArr = Array.from(document.getElementsByClassName("req"));

    for (let index = 0; index < reqBtnArr.length; index++) {
      if (reqBtnArr[index].getAttribute("name") === aboutId) {
        reqArr.push(reqBtnArr[index]);
      }
    }

    if (reqArr[1].classList.contains("d-none")) {
      reqArr[0].classList.add("d-none");
      reqArr[2].classList.remove("d-none")

      //api calling to save request status
      const res = await fetch(`${value.host}/api/social/post/view/req/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
          isreq: true,
          userId: userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        reqArr[0].classList.remove("d-none");
        reqArr[2].classList.add("d-none")
      } else {
        reqArr[1].classList.remove("d-none");
        reqArr[2].classList.add("d-none");

        //socket to send request
        socket.emit("viewReq", {
          req: data.newReq,
          userId: value.userId,
          userAboutId: userId,
        });
      }

    } else {
      reqArr[1].classList.add("d-none");
      reqArr[2].classList.remove("d-none");

      //api calling to save request status
      const res = await fetch(`${value.host}/api/social/post/view/req/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          user: `${value.userId}`,
          aboutId: aboutId,
          isreq: false,
        }),
      });
      const data = await res.json();
      if (data.error) {
        reqArr[2].classList.add("d-none");
        reqArr[1].classList.remove("d-none");
      } else {
        reqArr[2].classList.add("d-none");
        reqArr[0].classList.remove("d-none");

        //socket to send request
        socket.emit("deleteviewReq", {
          userAboutId: userId,
          userId: value.userId,
          id: data.id,
        });
      }

    }
    await fetchView()
  };

  //function to fetch all view req
  const fetchView = async () => {
    const res = await fetch(`${value.host}/api/social/post/view/get`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`
      }),
    })
    const data = await res.json()
    if (data.error) {

    } else {
      setallViewReq(data.allViewReq)
    }
  }

  //function to fetch likes
  const fetchLikes = async () => {
    const res = await fetch(`${value.host}/api/social/post/like/fetch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authToken: `${value.authtoken}`,
      },
      body: JSON.stringify({
        user: `${value.userId}`,
      }),
    });
    const data = await res.json();
    setallLikes(data.allLikes);
    data.allLikes ? isLiked(data.allLikes) : ""
  };

  //function to show likes
  const isLiked = async (allLikesparams) => {
    if (allLikesparams.length !== 0) {
      allLikesparams.map((like) => {
        if (document.getElementsByClassName("fa-heart")) {
          Array.from(document.getElementsByClassName("fa-heart")).map(
            (heart, index) => {
              if (
                heart.getAttribute("name") === like.aboutId &&
                like.isLiked === true
              ) {
                if (heart.classList.contains("fa-solid")) {
                  heart.classList.remove("d-none");
                } else {
                  heart.classList.add("d-none");
                }
              }
            }
          );
        }
      });
    }
  };

  //function to search
  const search = async (tag) => {
    const searchAbout = []
    const elemArr = Array.from(document.getElementsByClassName("singlePost"))
    if (tag) {
      if (about.length !== 0) {
        for (let index = 0; index < about.length; index++) {
          about[index].about.toLowerCase().includes(tag.toLowerCase()) ? searchAbout.push(about[index]._id) : ""
        }
      }
      for (let index = 0; index < elemArr.length; index++) {
        const id = elemArr[index].getAttribute("name")
        if (!(searchAbout.includes(id))) {
          document.getElementsByClassName("singlePost")[index].classList.add("d-none")
        } else {
          document.getElementsByClassName("singlePost")[index].classList.remove("d-none")
        }
      }
    } else {
      for (let index = 0; index < elemArr.length; index++) {
        document.getElementsByClassName("singlePost")[index].classList.remove("d-none")
      }
    }
  }

  //function to fetch all likes of a particular post
  const aboutLikefunc = async () => {
    if (about.length !== 0) {
      let aboutId = []
      for (let index = 0; index < about.length; index++) {
        aboutId.push(about[index]._id)
      }
      const res = await fetch(`${value.host}/api/social/post/like/about/fetch`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authToken: `${value.authtoken}`,
        },
        body: JSON.stringify({
          aboutId: aboutId
        }),
      })
      const data = await res.json()
      setaboutLike(data.allLikes)
    }
  }

  //function to show a particular post 
  const filterPost = async () => {
    if (value.urlPath.includes("post") || location.pathname.includes("post")) {
      if (about.length !== 0) {
        const arr = Array.from(document.getElementsByClassName("singlePost"))
        arr.forEach((elem, index) => {
          if (elem.getAttribute("name") !== id) {
            document.getElementsByClassName("singlePost")[index].classList.add("d-none")
          }
        })
      }
    }
  }

  const postControl = async () => {
    await fetchAbout()
  };

  useEffect(() => {
    if (isConnected === true) {
      filterPost()
      fetchLikes()
      postControl();
      if (value.islogout === false) {
        getOriUser();
        fetchAllFollow();
        fetchView()
      }
      value.fetchNotificationToRead()
    }
  }, [isConnected]);

  useEffect(() => {
    if (value.islogout === false) {
      fetchAllFollow();
      fetchView()
    }
  }, [reqStatus])

  useEffect(() => {
    value.fetchNotificationToRead()
  }, [follow, comments, like, view])

  useEffect(() => {
    fetchAllComment()
  }, [comments])

  useEffect(() => {
    if (about.length != 0) {
      fetchFile();
      fetchAllComment();
      aboutLikefunc()
    }
    about.length === 0 ? setmessage("Make Your First Post") : ""
  }, [about]);

  useEffect(() => {
    if (about.length !== 0) {
      fetchLikes()
      about.forEach((aboutElem, index) => {
        if (notes[index]) {
          setisDisplay(false)
        } else {
          setisDisplay(true)
        }
      })
    }
  }, [about, notes])

  useEffect(() => {
    if (value.islogout === false) {
      isLiked(allLikes)
    }
  }, [allLikes])


  useEffect(() => {
    filterPost()
    if (about.length !== 0) {
      if (document.getElementsByClassName("singlePost")) {
        if (value.urlPath === "/" || location.pathname === "/") {
          const arr = Array.from(document.getElementsByClassName("singlePost"))
          arr.forEach((elem, index) => {
            document.getElementsByClassName("singlePost")[index].classList.remove("d-none")
          })
        }
      }
    }
  }, [value.urlPath, about])


  return (
    <div>
      <ShareModal url={shareUrl} seturl={setshareUrl} />
      <Navbar search={search} />
      {isConnected!==null && <div className={`${about.length === 0 && isLoaded === true ? "" : "d-none"} rotatingBorder`} >
        <RotatingBorder message={message} />
      </div>}
      {/* sckeleton loader  */}
      {isConnected!==false && <div className={`contentLoader d-flex justify-content-center mt-3 ${isLoaded === true ? "d-none" : ""}`}>
        <ContentLoader
          speed={2}
          width={400}
          height={460}
          viewBox="0 0 400 460"
          backgroundColor="#8593ff"
          foregroundColor="#616bff"

        >
          <circle cx="68" cy="87" r="25" />
          <rect x="219" y="77" rx="2" ry="2" width="120" height="14" />
          <rect x="109" y="75" rx="2" ry="2" width="66" height="14" />
          <rect x="42" y="127" rx="15" ry="15" width="300" height="268" />
        </ContentLoader>
      </div>}
      {/* login modal  */}
      <LoginModal />

      <div className="allPosts my-4 user-select-none">
        {about.length !== 0
          ? about.map((about, index) => {
            return (
              <div
                key={about._id} name={about._id}
                className=" px-1 px-md-4 py-3 mx-md-4 mx-1 my-2 mb-5 singlePost"
                style={{
                  transform: "translateZ(15px)",
                  boxShadow: "0px 0px 20px #0d6efd",
                }}
              >
                {/* post header  */}
                <div key={value.userId} className="header d-flex justify-content-between py-2 bg-body-tertiary">
                  {/* image and name  */}
                  <div
                    data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
                    data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`} className="profileImgAndName px-2 d-flex justify-content-between  w-auto py-2 align-items-center">
                    <Link to={value.islogout === false ? `/social/profile/${user[index]._id}` : ""}><div className="profileImg mx-2">
                      <img
                        className=" rounded-circle"
                        src={
                          user.length !== 0 && user[index].profileimg !== "undefined"
                            ? user[index].profileimg
                            : defaultUserImg
                        }
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div></Link>

                    <div className="posterName fw-semibold fs-6 ">
                      {user.length !== 0
                        ? `${user[index].firstName} ${user[index].lastName}`
                        : ""}
                    </div>
                  </div>

                  {/* follow section normal state  */}
                  <div
                    data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
                    data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}
                    className={`normalState ${user[index]._id === value.userId ? "d-none" : ""} ${allFollow.length !== 0 ? allFollow.some(obj => obj.followingId === user[index]._id) ? "d-none" : "" : ""} px-2  d-flex justify-content-center align-items-center fw-bold fs-5 text-primary`}
                    onClick={async (e) => {
                      e.preventDefault();
                      const currentTarget = e.currentTarget
                      if (value.islogout === false) {
                        // e.currentTarget.style.display = "none"
                        e.currentTarget.getElementsByClassName("follow")[0].querySelector(".text").classList.add("d-none")
                        e.currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-plus").classList.add("d-none")
                        e.currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-spinner").classList.remove("d-none")
                        //api calling to save follow request
                        const res = await fetch(`${value.host}/api/social/post/follow/req`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            authToken: `${value.authtoken}`,
                          },
                          body: JSON.stringify({
                            user: `${value.userId}`,
                            aboutId: about._id,
                            isreq: true,
                            userId: user[index]._id
                          }),
                        });
                        const data = await res.json()
                        if (data.error) {
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".text").classList.remove("d-none")
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-plus").classList.remove("d-none")
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-spinner").classList.add("d-none")
                        } else {
                          socket.emit("followReq", {
                            followingId: data.newReq.followingId,
                            id: data.newReq._id,
                            userId: value.userId,
                          });
                          const resfetch = await fetch(`${value.host}/api/social/post/follow/get`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              authToken: `${value.authtoken}`,
                            },
                            body: JSON.stringify({
                              user: `${value.userId}`,
                            }),
                          });
                          const datafetch = await resfetch.json();
                          if (datafetch.error) {

                          } else {
                            setallFollow(datafetch.allFollow);
                          }
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".text").classList.remove("d-none")
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-plus").classList.remove("d-none")
                          currentTarget.getElementsByClassName("follow")[0].querySelector(".fa-spinner").classList.add("d-none")
                        }
                      }

                    }}

                    style={{ cursor: "pointer" }}
                  >
                    <span className={`followText follow `}>
                      <span className="text">Follow</span><i className="fa-solid fa-plus mx-2"></i><i className="fa-solid fa-spinner fa-spin me-3 d-none"></i>
                    </span>
                    <span
                      className={`followText request d-none text-success `}
                    >
                    </span>
                    <span
                      className={`followed text-success user-select-none d-none `}
                    >
                    </span>
                  </div>

                  {/* follow request section on refrash state */}
                  {allFollow.map((follow) => {
                    if (follow.followingId === user[index]._id && user[index]._id !== value.userId) {

                      return (
                        <div
                          className={`${value.islogout === true ? "d-none" : ""} exitedState follow followsection px-2 d-flex justify-content-center align-items-center fw-bold fs-5 text-primary`}
                          onClick={async (e) => {
                            e.preventDefault();
                            const currentTarget = e.currentTarget
                            e.currentTarget.getElementsByClassName("followText")[1].querySelector(".text").classList.add("d-none")
                            e.currentTarget.getElementsByClassName("followText")[1].querySelector(".fa-circle-check").classList.add("d-none")
                            e.currentTarget.getElementsByClassName("followText")[1].querySelector(".fa-spinner").classList.remove("d-none")
                            await handelFollow(
                              about._id,
                              user[index]._id,
                              e.currentTarget, false
                            );
                            currentTarget.getElementsByClassName("followText")[1].querySelector(".text").classList.remove("d-none")
                            currentTarget.getElementsByClassName("followText")[1].querySelector(".fa-circle-check").classList.remove("d-none")
                            currentTarget.getElementsByClassName("followText")[1].querySelector(".fa-spinner").classList.add("d-none")
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <span
                            className={`followText follow ${follow.isaccept === true ? "d-none" : ""}  ${follow.isRejected === true ? "" : "d-none"}`}
                          >
                            Follow<i className="fa-solid fa-plus mx-2"></i>
                          </span>
                          <span
                            className={`fs-6 followText follow ${follow.isreq === true && follow.isaccept === false && follow.isRejected === false
                              ? ""
                              : "d-none"
                              } `}
                            style={{ color: "orange" }}
                          >
                            <span className="text">Request</span>
                            <i className="fa-solid fa-circle-check mx-2"></i>
                            <i className="fa-solid fa-spinner fa-spin me-3 d-none"></i>
                          </span>
                          <span
                            className={`fs-6 followed text-success user-select-none ${follow.isreq === true && follow.isaccept === true && follow.isRejected === false
                              ? ""
                              : "d-none"
                              }`}
                          >
                            Following&nbsp;
                            <i className="fa-solid fa-user-plus"></i>
                          </span>
                        </div>
                      );
                    }

                  })}
                </div>

                {/* about post  */}
                <div
                  className="about py-2 fw-semibold px-2 fs-5"
                  style={{ backgroundColor: "#FEFFD2" }}
                >
                  {about.about}
                </div>

                <div name={about._id} key={`${about._id}${uuid()}`}
                  className="postBody overflow-hidden position-relative"
                  style={{
                    height: "400px",
                    backgroundImage: `url(${postBackground})`,
                    backgroundSize: "cover",
                  }}
                >
                  {/* accessnotes in normal state  */}
                  <div
                    name={about._id}
                    className={`${user[index]._id === value.userId ? "d-none" : ""
                      } ${allViewReq.length !== 0 ? allViewReq.some(obj => obj.aboutId === about._id) ? "d-none" : "" : ""} ${allViewReq.length !== 0 ? allViewReq.some(obj => obj.aboutId === about._id && obj.isaccept === true) ? "d-none" : "" : ""}  accessNotesNormal position-absolute top-0 start-0 w-100 h-100 z-1`}
                    style={{ backgroundColor: "#4d4d4d9c" }}
                  >
                    <div className="glow normal position-relative w-100 h-100 d-flex align-items-center justify-content-center">
                      <button

                        data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
                        data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}
                        className="glowbtn position-relative fw-semibold fs-5 "
                        onClick={async (e) => {
                          e.preventDefault();
                          const currentTarget = e.currentTarget
                          if (value.islogout === false) {
                            e.currentTarget.getElementsByClassName("req")[0].innerHTML = "Please Wait"
                            const res = await fetch(`${value.host}/api/social/post/view/req/post`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                authToken: `${value.authtoken}`,
                              },
                              body: JSON.stringify({
                                user: `${value.userId}`,
                                aboutId: about._id,
                                isreq: true,
                                userId: user[index]._id,
                              }),
                            });
                            const data = await res.json();
                            //socket to send request
                            socket.emit("viewReq", {
                              req: data.newReq,
                              userId: value.userId,
                              userAboutId: user[index]._id,
                            });
                            await fetchView()
                            currentTarget.disabled = false
                            currentTarget.getElementsByClassName("req")[0].innerHTML = `Request ${user.length !== 0 ? ` ${user[index].firstName} ` : ""} to see notes`
                          }else{
                            currentTarget.disabled = false
                          }
                        }}
                      >
                        <span className="req" >
                          Request
                          {user.length !== 0
                            ? ` ${user[index].firstName} `
                            : ""}
                          to see notes
                        </span>
                        <span className="req d-none" >

                        </span>
                      </button>
                    </div>
                  </div>

                  {/* accessnotes in excites state  */}
                  {allViewReq.map((req) => {
                    if (req.aboutId === about._id && value.islogout === false) {
                      return <div
                        name={about._id}
                        className={`${user[index]._id === value.userId ? "d-none" : ""
                          } ${req.isaccept === true ? "d-none" : ""} accessNotesExcite position-absolute top-0 start-0 w-100 h-100 z-1`}
                        style={{ backgroundColor: "#4d4d4d9c" }}
                      >
                        <div className="glow position-relative w-100 h-100 d-flex align-items-center justify-content-center">
                          <button
                            className="glowbtn position-relative fw-semibold fs-5 "
                            onClick={async (e) => {
                              e.preventDefault();
                              const currentTarget = e.currentTarget
                              e.currentTarget.disabled = true
                              await handelViewReq(about._id, user[index]._id);
                              currentTarget.disabled = false
                            }}
                          >
                            <span className={`req ${req.isaccept === false && req.isreq === true && req.isRejected === true ? "" : "d-none"}`} name={about._id} >
                              Request{" "}
                              {user.length !== 0
                                ? `${user[index].firstName}`
                                : ""}{" "}
                              to see notes
                            </span>
                            <span className={`req  ${req.isaccept === false && req.isreq === true && req.isRejected === false ? "" : "d-none"}`} name={about._id}>
                              Request Sent
                            </span>
                            <span name={about._id} className="req d-none">
                              Please Wait
                            </span>
                          </button>
                        </div>
                      </div>
                    }

                  })}

                  {/* notes section  */}
                  <div className="notesection overflow-auto w-100 h-100" style={{ scrollbarWidth: "thin" }}>
                    {folderPath.length !== 0
                      ? folderPath[index].map((path) => {
                        return (
                          <div className="folderPathforNotesection" path={path} name={about._id}>
                            <div
                              className="fw-semibold px-2 py-1"
                              key={uuid()}
                              style={{
                                backgroundColor: "#7e8ef19e",
                                fontStyle: "italic",
                              }}
                            >
                              {path}
                            </div>
                            {/* getting notes in a loop  */}
                            <div path={path} name={about._id} className="filecards d-flex flex-wrap justify-content-center py-3">
                              {notes.length !== 0
                                ? notes[index].map((note) => {
                                  if (path === note.folderPath) {

                                    return (
                                      <div
                                        path={path} name={about._id}
                                        key={note._id}
                                        className=" m-md-3 m-1 cardSize noteDiv position-relative"
                                      >
                                        <div
                                          onClick={(e) => {
                                            e.preventDefault()
                                            showFiles(note.file.url, note.file.desc)
                                          }}
                                          className="card h-auto"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div
                                            className="card-img-top mx-auto pt-2 cradImg "
                                            style={{ width: "65%" }}
                                          >
                                            <FileIconComponent
                                              extention={
                                                note.file.extention
                                              }
                                            />
                                          </div>

                                          <div className="card-body p-0">
                                            <p
                                              className=" w-100 cardName fw-bold card-title text-center mb-0 fs-6 overflow-auto p-2 "
                                              style={{
                                                scrollbarWidth: "thin",
                                              }}
                                            >
                                              {note.file.originalname}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })
                                : ""}
                            </div>
                          </div>
                        );

                      })
                      : ""}<div className={`cardloader w-100 h-100 ${isDisplay === false ? "d-none" : ""} `} name={about._id} ><CardLoading /></div>
                  </div>
                </div>

                {/* post footer  */}
                <div className="postFooter d-flex justify-content-between align-items-center fs-3 pt-2 ">
                  {/* like btn  */}
                  <div
                    data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
                    data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}

                    title="Like Post"
                    className="likePost mx-3 position-relative "
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (value.islogout === false) {
                        handellike(about._id, user[index]._id);
                      }
                    }}
                  >
                    <i
                      className="fa-solid fa-heart d-none text-danger"
                      name={about._id}
                    ></i>
                    <i
                      className="fa-regular fa-heart text-danger"
                      name={about._id}
                    ></i>
                    <span className=" d-inline-block position-absolute ms-2" style={{ top: "11px", fontSize: "15px", width: "100px" }}>{`${aboutLike.length !== 0 ? aboutLike[index].length + " likes" : ""}`}</span>
                  </div>
                  {/* comment btn  */}
                  <div
                    data-bs-toggle={`${value.islogout === true ? "modal" : ""}`}
                    data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : ""}`}

                    title="Comment"
                    className="commentPost mx-3 position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (value.islogout === false) {
                        const ind = Array.from(
                          document.getElementsByClassName("commentPost")
                        ).indexOf(e.currentTarget);
                        handelComment(about._id, ind, user[index]._id);
                      }
                    }}
                  >
                    <i className=" fa-regular fa-comment text-primary"></i>
                    <span className=" d-inline-block position-absolute ms-2" style={{ top: "11px", fontSize: "15px", width: "100px" }}>{`${allComment.length !== 0 ? allComment[index].length + " comments" : ""}`}</span>
                  </div>
                  {/* share btn  */}
                  <div

                    data-bs-toggle={`${value.islogout === true ? "modal" : "modal"}`}
                    data-bs-target={`${value.islogout === true ? "#exampleModalLogin" : "#exampleModalshare"}`}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Share"
                    className="sharePost mx-3"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault()
                      setshareUrl(`https://notebridge2005.netlify.app/post/${about._id}`)
                    }}
                  >
                    <i className=" fa-regular fa-share-from-square text-primary-emphasis"></i>
                  </div>
                </div>

                {/* comment section  */}
                <div
                  className="comments my-3 d-none"
                  name={about._id}
                  id="comments"
                >
                  <div className="commentForm py-3">
                    <form
                      className="formcomments d-flex justify-content-center align-items-center"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const i = Array.from(
                          document.getElementsByClassName("formcomments")
                        ).indexOf(e.currentTarget);
                        const inputValue =
                          document.getElementsByClassName("commentInput")[i]
                            .value;
                        submitCom(about._id, inputValue, user[index]._id);
                        document.getElementsByClassName("commentInput")[
                          i
                        ].value = "";
                        fetchAllComment();
                      }}
                    >
                      <div className="profileImgOfComment mx-2">
                        <img
                          className=" rounded-circle"
                          src={originalUser && originalUser.profileimg !== "undefined" ? originalUser.profileimg : defaultUserImg}
                          style={{ width: "30px", height: "30px" }}
                        />
                      </div>
                      <div className="name fw-semibold">{`${originalUser && originalUser.firstName}`}</div>
                      <input
                        required
                        className="commentInput w-75 mx-3"
                        placeholder="Write Your Comment"
                        style={{
                          outline: "none",
                          border: "none",
                          borderBottom: "2px solid black",
                          backgroundColor: "transparent",
                        }}
                      />
                      <button
                        type="submit"
                        className=" commentSubmit btn btn-primary rounded-5 px-2 py-1"
                      >
                        Post
                      </button>
                    </form>
                  </div>

                  {/* others comment section  */}
                  {commentUser.length !== 0
                    ? commentUser[index].map((eachUser, i) => {
                      return (
                        <div className="otherComments p-3 d-flex align-items-center">
                          <div className="commentHeader">
                            <div className="profileImgOfComment mx-2">
                              <img
                                className=" rounded-circle"
                                src={eachUser.profileimg !== "undefined" ? eachUser.profileimg : defaultUserImg}
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                            <div className="nameOfComment"></div>
                          </div>
                          <div className="commentBody">
                            <div className="userName fw-light">{`${eachUser.firstName} ${eachUser.lastName}`}</div>
                            <div className="commentContent fw-medium">
                              {allComment[index][i].comment}
                            </div>
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </div>
              </div>
            );
          })
          : ""}
      </div>
    </div>

  );
}

export default post;
