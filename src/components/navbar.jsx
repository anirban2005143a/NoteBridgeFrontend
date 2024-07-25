<<<<<<< HEAD
import React, { useContext, useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import NoteContext from "../context/notes/noteContext";

const navbar = (props) => {
  const location = useLocation();
  const value = useContext(NoteContext);

  const [searchInput, setsearchInput] = useState('')

  useEffect(() => {
   
      console.log(searchInput)
      props.search(searchInput)

  }, [searchInput])


  return (
    <nav className="d-sm-flex justify-content-between w-auto my-2 mx-2">
      <div className="bg-secondary-subtle mx-auto d-flex justify-content-center align-items-center rounded-3">
        <i
          className="fa fa-search p-2 ms-1"
          style={{ borderRight: "1px solid black" }}
        ></i>
        <form className=" d-flex justify-content-center" onSubmit={(e) => {
          e.preventDefault()
          props.search(e.currentTarget.querySelector('input').value)
        }}>
          <input
            onChange={(e) => {
              e.preventDefault()
              setsearchInput(e.target.value)
            }}
            value={searchInput}
            type="text"
            className="form-control"
            placeholder="Search Here"
            style={{
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              boxShadow:"none"
            }}
          />
          <button className="btn btn-primary">Search</button>
        </form>
      </div>

    </nav>
  );
};

export default navbar;
=======
import React, { useContext, useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import NoteContext from "../context/notes/noteContext";

const navbar = (props) => {
  const location = useLocation();
  const value = useContext(NoteContext);

  const [searchInput, setsearchInput] = useState('')

  useEffect(() => {
   
      console.log(searchInput)
      props.search(searchInput)

  }, [searchInput])


  return (
    <nav className="d-sm-flex justify-content-between w-auto my-2 mx-2">
      <div className="bg-secondary-subtle mx-auto d-flex justify-content-center align-items-center rounded-3">
        <i
          className="fa fa-search p-2 ms-1"
          style={{ borderRight: "1px solid black" }}
        ></i>
        <form className=" d-flex justify-content-center" onSubmit={(e) => {
          e.preventDefault()
          props.search(e.currentTarget.querySelector('input').value)
        }}>
          <input
            onChange={(e) => {
              e.preventDefault()
              setsearchInput(e.target.value)
            }}
            value={searchInput}
            type="text"
            className="form-control"
            placeholder="Search Here"
            style={{
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              boxShadow:"none"
            }}
          />
          <button className="btn btn-primary">Search</button>
        </form>
      </div>

    </nav>
  );
};

export default navbar;
>>>>>>> 1ba023f04579a4a37a75687e7e4c8ec4627c881e
