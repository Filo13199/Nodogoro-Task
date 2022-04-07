import React, { useEffect ,useState} from "react";
import {useLocation} from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";

const Profile = (props) => {
   const [user,setUser]=useState(props.user);
  
  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;