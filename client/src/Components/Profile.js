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
  const [given_name, setFirstName] = useState(null);
  const [family_name, setLastName] = useState(null);
  const [password, setPassword] = useState(null);
  const [repeat_password, setRepeat_password] = useState(null);
  const updateUserHandler = async (e) => {
    const accessToken = await props.getAccessTokenSilently();
    const reqBody = {};
    if (password && repeat_password === password)
      reqBody.password = password;
    reqBody.given_name = given_name;
    reqBody.family_name = family_name;
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
    if (props.user) {
      setUser(props.user);
      setEmail(props.user.email);
      setFirstName(props.user.given_name);
      setLastName(props.user.family_name);
      }
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
              <Typography className="title"> {user ? user.name : ""} </Typography>
            </div>
          </div>
          <div className="row">
            <div className="column-full">
              <Typography className="title"> {user ? user.given_name || user.nickname : ""} </Typography>
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
              <Typography className="value"> {user && user.phone_number ? user.phone_number : "-"} </Typography>
            </div>
          </div>
        </Paper>
      </div>
      <Paper className="viewEditUserInfoContainer">
        <div className="largeRow">
          <Typography className="fieldTitle"> E-Mail </Typography>
          <TextField className="field"
            value={user && user.email}
            disabled
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle"> First Name </Typography>
          <TextField className="field"
            value={user && given_name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="largeRow">
          <Typography className="fieldTitle"> Last Name </Typography>
          <TextField className="field"
            value={user && family_name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="largeRow">
          <Typography className="fieldTitle"> Password</Typography>
          <TextField className="field"
            value={user && password}
            onChange={(e) => setPassword(e.target.value)}
            error={repeat_password !== password}
            type="password"

          />
        </div>

        <div className="largeRow">
          <Typography className="fieldTitle"> Repeat Password</Typography>
          <TextField className="field"
            value={user && repeat_password}
            onChange={(e) => setRepeat_password(e.target.value)}
            error={repeat_password !== password}
            type="password"
          />
        </div>
        <div className="largeRow">
        <Button className="button" onClick={updateUserHandler}> Update </Button>
        </div>

      </Paper>

    </div>
  );
};

export default Profile;