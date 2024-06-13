import React , {useState , useContext} from "react";
import Alert from "../alert"
import { Link ,useNavigate} from "react-router-dom";
import NoteContext from "../../context/notes/noteContext";
import { uploadFileToFirebase } from "../../firebase/savefile";
import { deleteFileFromFirebase } from "../../firebase/deletefile";


const SignupForm = () => {

  const value = useContext(NoteContext)
  const navigate = useNavigate()

  const [tempimgurl, settempimgurl] = useState(value.userImg)
  const [profileImgfile, setprofileImgfile] = useState(null)


  //function to display the selected image as profile image
  const handleimage = (e)=>{
    const file = e.target.files[0];
    if(file){
      setprofileImgfile(file)
      const tempimgurl = URL.createObjectURL(file)
      settempimgurl(tempimgurl)
    }
  }

  //function to creat a new user
  const creatUser = async ()=>{
    if(document.getElementById("exampleInputPassword").value === document.getElementById("exampleInputPasswordConfirm").value){
      
      document.getElementById("submit").innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating User...`
      document.getElementById("submit").disabled = true

      //uploading profile image to firebase if an image is choosen
      let profileImgUrl = undefined ,tempPath, path//declear a valiable to store profile image url , and its path when it is uploaded
      if(profileImgfile !== null){
        path = "profileIMG/" + document.getElementById("exampleInputFirstName").value + `${(Math.random() * 10)}` + document.getElementById("exampleInputLastName").value + `${Date.now()}` 
        tempPath = path
        profileImgUrl = await (uploadFileToFirebase(path , profileImgfile))
      }

      //creat a json file wih form inputs
          const formData = new FormData();
          formData.append("url" ,profileImgUrl)
          formData.append("firstName" ,document.getElementById("exampleInputFirstName").value)
          formData.append("lastName" ,document.getElementById("exampleInputLastName").value)
          formData.append("email" , document.getElementById("exampleInputEmail").value)
          formData.append("password" , document.getElementById("exampleInputPassword").value )
          formData.append("about" , document.getElementById("exampleAboutUser").value )

        try {
            //fetch api to creat a new user
            const res = await fetch(`${value.host}/api/auth/create` , {
                method : "POST",
                headers:{},
                body: formData
            })
            const data = await res.json()
            //set all inputs clear
            document.querySelectorAll("input").forEach((input)=>{
              input.value = ""
            })
            settempimgurl(value.userImg)//set profile image to default
            document.getElementById("submit").disabled = false
            document.getElementById("exampleCheck1").checked = false//make check box value false
    
              if (data.error) {//if error ocured due to short inputs
                //remake submit button text 
                document.getElementById("submit").innerHTML = "Sign-up"
                await deleteFileFromFirebase(tempPath)
                profileImgUrl = undefined
                value.setisOK(false)
                value.setmessage(`${data.message}`)
              } else {//if all is well
                //remake submit button text to said redirecting
                document.getElementById("submit").disabled = true
                document.getElementById("submit").innerHTML = "Redirecting ..."
                //store user authtoken and uerid
                value.authtoken = data.jwtToken
                value.userId = data.userid
                value.setislogout(false)//make sure that he is loged in
                //setting for alert component
                value.setisOK(true)
                value.setmessage("User Created successfully!")
                //save authtokena and userid in localstorage
                localStorage.setItem("authtoken" , data.jwtToken)
                localStorage.setItem("userId" , data.userid)
                localStorage.removeItem("folderPath")
                localStorage.removeItem("baseFolderPath")
                //redirect to home page after 
                setTimeout(() => {
                  window.location.href = "/"
                }, 1000);
              }
             
            } catch (error) {
                value.setmessage("There was a problem with the upload. Please try again.")
            }

    }else{
        value.setisOK(false)
        value.setmessage("Passwords are different")
       
    }

  }

  return (
    <div className="Content background overflow-hidden">
      {/* alert for any change */}
      <Alert isdisplay={value.isOK == null ? false : true} mode = {`${value.isOK===true ? "success" : "danger"}`} message = {value.message} />
      <div className="form position-relative overflow-auto w-100 h-100"><form
        className=" w-50 p-3 z-2 animate-from-top"
        style={{transform: "translate(50% , 10%)"}}
        onSubmit={(e)=>{
            e.preventDefault()
            creatUser()
        }}
      >
        {/* close button to go to previous page  */}
        <div className="close position-relative" style={{height:'20px'}}>
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0"
            aria-label="Close"
            onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
          ></button>
        </div>
         {/* user profile image  */}
         <div className="image overflow-hidden " >
          <div className="image mx-auto position-relative" style={{width:"75px"}}>
            <img src={tempimgurl}  style={{width : "70px" , height :"70px" , borderRadius :"50%" , objectFit:"cover" , objectPosition : "center"}}/>
            {/* input for choosing profile image  */}
            <label htmlFor="setProfileImage" className=" bg-black position-absolute bottom-0 end-0 px-1 rounded-circle" data-toggle="tooltip" data-placement="bottom" title="Set Profile Image"><i className="fa-solid fa-camera" style={{color: "#c7c7c7"}}></i></label>
            <input id="setProfileImage" accept="image/*" type="file" className=" d-none" onChange={handleimage}/>
          </div>
        </div>
        {/* user first name  */}
        <div className="form-group my-1 ">
          <label htmlFor="exampleInputFirstName" className=" fw-semibold"> First Name</label>
          <input
            required
            type="text"
            className="form-control fw-semibold"
            id="exampleInputFirstName"
            aria-describedby="emailHelp"
            placeholder="Enter First Name"
            minLength={3}
          />
        </div>
        {/* user last name  */}
        <div className="form-group my-1">
          <label htmlFor="exampleInputLastName" className=" fw-semibold"> Last Name</label>
          <input
            required
            type="text"
            className="form-control fw-semibold"
            id="exampleInputLastName"
            aria-describedby="emailHelp"
            placeholder="Enter Last Name"
            minLength={3}
          />
        </div>
        {/* user email  */}
        <div className="form-group my-1">
          <label htmlFor="exampleInputEmail" className=" fw-semibold">Email address</label>
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
          <label htmlFor="exampleInputPassword" className=" fw-semibold">Password</label>
          <input
            required
            type="password"
            className="form-control fw-semibold"
            id="exampleInputPassword"
            placeholder="Password"
            minLength={5}
          />
        </div>
        {/* user password for check */}
        <div className="form-group my-1">
          <label htmlFor="exampleInputPasswordConfirm" className=" fw-semibold">Repeat Password</label>
          <input
            required
            type="password"
            className="form-control fw-semibold"
            id="exampleInputPasswordConfirm"
            placeholder="Repeat Password"
          />
        </div>
        {/* about yourself  */}
        <div className="form-group my-1">
          <label htmlFor="exampleAboutUser" className=" fw-semibold">About Yourself</label>
          <input
            required
            type="about"
            className="form-control fw-semibold"
            id="exampleAboutUser"
            placeholder="About Yourself"
          />
        </div>
        {/* check robot or not  */}
        <div className="form-check">
          <input
            required
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Verification
          </label>
        </div>
        <button type="submit" id="submit" className="btn btn-primary my-2">
          Sign-up
        </button>
        <p className=" fw-light mb-0">already have an account? <Link to="/user/logIn" className=" fw-medium text-danger link-underline-danger">log-in</Link></p>
      </form></div>
      
    </div>
  );
};

export default SignupForm;
