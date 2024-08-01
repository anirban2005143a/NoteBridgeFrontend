import React, { useState, useContext } from "react";
import Alert from "../alert";
import { Link, useNavigate } from "react-router-dom";
import NoteContext from "../../context/notes/noteContext";
import '../../css/form.css'

const LoginForm = () => {
  const value = useContext(NoteContext);
  const navigate = useNavigate();

  //function for login a existing user
  const loginUser = async () => {
    //change login button text to show the uploading process
    document.getElementById(
      "submit"
    ).innerHTML = `<i className="fa-solid fa-spinner fa-spin"></i> loging in...`;

    try {
      const res = await fetch(`${value.host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.getElementById("exampleInputEmail").value,
          password: document.getElementById("exampleInputPassword").value,
        }),
      });
      const data = await res.json();
      //set all inputs clear and submit button to its original form
      document.getElementById("exampleInputEmail").value = "";
      document.getElementById("exampleInputPassword").value = "";

      if (data.error) {
        //if error ocured due to short inputs
        document.getElementById("submit").innerHTML = "Log-in";
        value.setisOK(false);
        value.setmessage(`${data.message}`);
      } else {
        //if all is well
        localStorage.removeItem("baseFolderPath"); //remove previous foldering paths
        localStorage.removeItem("folderPath"); //remove previous foldering paths
        //set authtoken and userid
        value.authtoken = data.jwtToken;
        value.userId = data.userid;
        document.getElementById("submit").innerHTML = "Redirecting ..."; //to show redirecting to home page
        setTimeout(() => {
          value.setisOK(true);
          value.setmessage("User LogIn successfully!");
        }, 500);
        //save authtokena and userid in localstorage
        localStorage.setItem("authtoken", data.jwtToken);
        localStorage.setItem("userId", data.userid);
        value.setislogout(false); //make sure that he is loged in
        navigate("/");
      }
    } catch (error) {
      //catches error
      value.setmessage(
        "There was a problem with the upload. Please try again."
      );
    }
  };

  return (
    <>{/* alert for any change */}
      <Alert
        isdisplay={value.isOK == null ? false : true}
        mode={`${value.isOK === true ? "success" : "danger"}`}
        message={value.message}
      />
      <div className="Content bg-black overflow-hidden" id="Content">
        <div className="heading fw-bold text-center mt-4 " style={{ color: "wheat", fontSize: "4rem" }}>Welcome!</div>
        <div className="form position-relative">
          <form
            className=" p-3 w-50 mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              loginUser();
            }}
          >
            {/* close button to go to previous page  */}
            <div className="close position-relative" style={{ height: "20px" }}>
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0"
                aria-label="Close"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              ></button>
            </div>
            {/* user email  */}
            <div className="formcontrol">
              <input
                required
                type="email"
                id="exampleInputEmail" />
              <label>
                <span style={{ transitionDelay: "0ms" }}>E</span>
                <span style={{ transitionDelay: "50ms" }}>n</span>
                <span style={{ transitionDelay: "100ms" }}>t</span>
                <span style={{ transitionDelay: "150ms" }}>e</span>
                <span style={{ transitionDelay: "200ms" }}>r</span>
                <span style={{ transitionDelay: "250ms" }}>{` `}</span>
                <span style={{ transitionDelay: "300ms" }}>E</span>
                <span style={{ transitionDelay: "350ms" }}>m</span>
                <span style={{ transitionDelay: "400ms" }}>a</span>
                <span style={{ transitionDelay: "450ms" }}>i</span>
                <span style={{ transitionDelay: "500ms" }}>l</span>
              </label>
            </div>

            {/* user password  */}
            <div className="formcontrol">
              <input
                minLength={5}
                required
                type="password"
                id="exampleInputPassword" />
              <label>
                <span style={{ transitionDelay: "0ms" }}>P</span>
                <span style={{ transitionDelay: "50ms" }}>a</span>
                <span style={{ transitionDelay: "100ms" }}>s</span>
                <span style={{ transitionDelay: "150ms" }}>s</span>
                <span style={{ transitionDelay: "200ms" }}>w</span>
                <span style={{ transitionDelay: "300ms" }}>o</span>
                <span style={{ transitionDelay: "350ms" }}>r</span>
                <span style={{ transitionDelay: "400ms" }}>d</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary mt-3" id="submit">
              Log-in
            </button>
            <button type="submit" id="submit" className="animated-button">
              <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
              <span className="text">Modern Button</span>
              <span className="circle"></span>
              <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
            </button>

            <p className=" fw-light mt-2 text-warning">
              does not have any account?{" "}
              <Link
                to="/user/signup"
                className=" fw-medium text-danger link-underline-danger"
              >
                creat one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
