import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NoteContext from "../context/notes/noteContext";
import '../css/navbar.css'

const navbar = (props) => {
  const location = useLocation();
  const value = useContext(NoteContext);

  const [searchInput, setsearchInput] = useState('')

  useEffect(() => {
    props.search(searchInput)
  }, [searchInput])


  return (
    <nav className="d-sm-flex justify-content-between w-auto my-2 mx-2" id='navbar'>
      <div className=" mx-auto d-flex justify-content-center align-items-center rounded-3 w-100">

        <form className=" d-flex justify-content-center align-items-end" onSubmit={(e) => {
          e.preventDefault()
          props.search(e.currentTarget.querySelector('input').value)
        }} >

          <div class="form__group field mx-3">
            <input required type="input" class="form__field" placeholder="Name" />
            <label for="name" class="form__label">Search</label>
          </div>

          <button type="submit" className="importedBtn rounded-2">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>

    </nav>
  );
};

export default navbar;
