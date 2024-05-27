import React from "react";
import image from "../bird_2.jpg";
const Header = () => {
  return (
    <>
      <nav className="main">
        <div className="logo">
          <img src={image} alt="logo" />
        </div>
        <div className="main1">To-Do</div>
      </nav>
    </>
  );
};
export default Header;
