import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../functions/logout";
import NoteContext from "../context/notes/noteContext";

const navbar = (props) => {
  const location = useLocation();
  const value = useContext(NoteContext);

  return (
    <nav className="d-sm-flex justify-content-between w-auto my-2 mx-2">
      <div className="bg-secondary-subtle mx-auto d-flex justify-content-center align-items-center rounded-3">
        <i
          className="fa fa-search p-2 ms-1"
          style={{ borderRight: "1px solid black" }}
        ></i>
        <form className=" d-flex justify-content-center" onSubmit={(e)=>{
          e.preventDefault()
          props.search(e.currentTarget.querySelector('input').value)
        }}>
          <input
            onChange={(e)=>{
              e.preventDefault()
              props.search(e.currentTarget.value)
            }}
            type="text"
            className="form-control"
            placeholder="Search Here"
            style={{
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
            }}
          />
          <button className="btn btn-primary">Search</button>
        </form>
      </div>
      
    </nav>
  );
};

export default navbar;
