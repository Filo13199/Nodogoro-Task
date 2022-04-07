import React from "react";
import Profile from "./Profile";
const Home = (props) => {


  return (
    <dev className="homeContainer" >
      <Profile  props={props}/>
    </dev>
  );
};

export default Home;