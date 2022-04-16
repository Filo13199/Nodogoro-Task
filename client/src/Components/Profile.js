import React, { useEffect, useState } from "react";
import { Paper, TextField, Typography ,Avatar, Button} from "@mui/material"
import axios from "axios";
import { link } from "../Helpers/Constants";
import Swal from 'sweetalert2';
import { deepOrange, deepPurple } from '@mui/material/colors';
import './styling/profile.scss'

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [address,setAddress] = useState(null);
  const [givenName, setFirstName] = useState(null);
  const [familyName, setLastName] = useState(null);
  const [name,setName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState(null);
  const [isSocial, setIsSocial] = useState(false);
  const initializeStates = (user)=>{
    setEmail(user.email);
    if(user.user_metadata){
      setAddress(user.user_metadata.address);
      setPhoneNumber(user.user_metadata.mobileNumber);
      setFirstName((user.user_metadata.given_name||user.given_name));
      setLastName((user.user_metadata.family_name||user.family_name));
      setName((user.user_metadata.given_name||user.given_name) +" "+ (user.user_metadata.family_name||user.family_name));

    }
    setUser(user);
  }
  const updateUserHandler = async (e) => {
    const accessToken = await props.getAccessTokenSilently();
    const reqBody = {};
    if (password && repeatPassword === password)
      reqBody.password = password;
    reqBody.user_metadata = {
        address: address,
        mobileNumber: phoneNumber,
        given_name: givenName,
        family_name: familyName
      }
      
    axios.patch(`${link}users/updateUser/${user.user_id}`, reqBody, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile Updated Successfully',
        })
        props.setUserMetadata(res.data.data);
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response&&err.response.data&&err.response.data.error?err.response.data.error:'Something went wrong!',
        })
      })
  }
  useEffect(() => {
    if (props.user)
      initializeStates(props.user);
  }, [props.user]);
  return (
    <div className="profileContainer">
      <div className="generalInfoContainer">
        <Paper className="profileCard">
          <div className="row">
            <div className="column-full">
            <div className="avatar" style={{backgroundColor:deepOrange[500]}}>N</div>            </div>
          </div>
          <div className="row">
            <div className="column-full">
              <Typography className="title"> { name} </Typography>
            </div>
          </div>
        </Paper>
        <Paper className="profileCard">
          <div className="row">
            <div className="column-half">
              <Typography className="title"> Email </Typography>
              <Typography className="value"> {user && user.email ? user.email : "-"} </Typography>
            </div>

          </div>
          <div className="row">
            <div className="column-half">
              <Typography className="title"> Mobile </Typography>
              <Typography className="value"> {(user&&user.user_metadata&&user.user_metadata.mobileNumber)?user.user_metadata.mobileNumber:"-"} </Typography>
            </div>
          </div>
        </Paper>
      </div>
      <Paper className="viewEditUserInfoContainer">
        
        <div className="formContainer">
        <div className="largeRow">
          <Typography className="fieldTitle"> First Name </Typography>
          <TextField className="field"
            value={givenName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle"> Last Name </Typography>
          <TextField className="field"
            value={familyName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle">Mobile Number </Typography>
          <TextField className="field"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle">Address </Typography>
          <TextField className="field"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle"> Password</Typography>
          <TextField className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            sx={{ input: { color: 'white' } }}
          />
        </div>

        <div className="largeRow">
          <Typography className="fieldTitle"> Repeat Password</Typography>
          <TextField className="field"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            error={((repeatPassword !== password)||(!password)&&(password))}
            type="password"
            sx={{ input: { color: 'white' } }}
          />
        </div>
        </div>
        <div className="buttonContainer">
        <Button className="button" onClick={updateUserHandler}> Update </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Profile;