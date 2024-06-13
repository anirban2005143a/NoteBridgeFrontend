import React, { useState, useContext } from "react";
import Alert from "../alert";
import { Link, useNavigate } from "react-router-dom";
import NoteContext from "../../context/notes/noteContext";

const LoginForm = () => {
  const value = useContext(NoteContext);
  const navigate = useNavigate();

  //function for login a existing user
  const loginUser = async () => {
    //change login button text to show the uploading process
    document.getElementById(
      "submit"
    ).innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> loging in...`;

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
    <>
      <div className="Content background overflow-hidden">
        {/* alert for any change */}
        <Alert
          isdisplay={value.isOK == null ? false : true}
          mode={`${value.isOK === true ? "success" : "danger"}`}
          message={value.message}
        />
        <div className="form position-relative overflow-auto w-100 h-100">
          <form
            className=" w-50 p-3 z-2 animate-from-top"
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
            <div className="form-group my-1">
              <label htmlFor="exampleInputEmail" className=" fw-semibold">
                Email address
              </label>
              <input
                required
                type="email"
                className="form-control fw-semibold"
                id="exampleInputEmail"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            {/* user password  */}
            <div className="form-group my-1">
              <label htmlFor="exampleInputPassword" className=" fw-semibold">
                Password
              </label>
              <input
                minLength={5}
                required
                type="password"
                className="form-control fw-semibold"
                id="exampleInputPassword"
                placeholder="Password"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3" id="submit">
              Log-in
            </button>
            <p className=" fw-light mt-2">
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
