import React, { useState, useEffect } from 'react';
import './styles/userInfo.scss';
import { TextField, Typography, Divider, Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { link } from '../../Helpers/Constants';
export default function UserInfo(props) {
  const [data, setData] = useState(null);
  const [givenName, setFirstName] = useState("");
  const [familyName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const initalizeStates = (user) => {
    setFirstName(user.given_name);
    setLastName(user.family_name);
    if (user.user_metadata) {
      setAddress(user.user_metadata.address);
      setMobileNumber(user.user_metadata.mobileNumber);
    }
    setData(user);
  }
  const updateUserHandler = async (e) => {
    const accessToken = await props.getAccessTokenSilently();
    const reqBody = {};
    if (!givenName || !familyName)
      return Swal.fire({
        title: 'Error',
        text: 'Please Enter Your Name',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    if (!address)
      return Swal.fire({
        title: 'Error',
        text: 'Please Enter Your Address',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    if (!mobileNumber)
      return Swal.fire({
        title: 'Error',
        text: 'Please Enter Your Phone Number',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    if (data.identities && data.identities[0].isSocial) {
      reqBody.user_metadata = {
        address: address,
        mobileNumber: mobileNumber,
        given_name: givenName,
        family_name: familyName
      }
    }
    else {
      reqBody.given_name = givenName;
      reqBody.family_name = familyName;
      reqBody.user_metadata = { mobileNumber: mobileNumber, address: address }
    }
    axios.patch(`${link}users/updateUser/${data.user_id}`, reqBody, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => {
        props.setUser(res.data.data);
        return props.handleNext();
      })
      .catch(err => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Something went wrong!',
        })
      })
  }
  const handleChangeUserInfo = async () => {
    await updateUserHandler();

  }
  useEffect(() => {
    if (props.user) {
      initalizeStates(props.user);
    }
  }, [props.user]);
  return (
    <div className="userInfoContainer">
      <div className="titleContainer">
        <div className="titleAndBarContainer">
          <Typography className="pageTitle">
            Account Information
          </Typography>
          <div className="pageTitleBar" />
        </div>
        <Divider className="pageDivider" />
      </div>
      <div style={{ padding: '1rem' }}>
        <h5 className="userInfoLabel">Name</h5>
        <div className="nameTextContainer" >
          <TextField
            value={givenName}
            onChange={(evt) => { setFirstName(evt.target.value) }}
            fullWidth
            id="outlined-basic"
            variant="outlined"
            className="userInfoText small"
            sx={{ input: { color: 'white' } }}
          />
          <TextField
            value={familyName}
            onChange={(evt) => { setLastName(evt.target.value) }}
            fullWidth
            id="outlined-basic"
            variant="outlined"
            className="userInfoText small"
            sx={{ input: { color: 'white' } }}
          />
        </div>
        <h5 className="userInfoLabel">Address</h5>
        <TextField
          value={address}
          onChange={(evt) => { setAddress(evt.target.value) }}
          id="outlined-basic"
          variant="outlined"
          className="userInfoText"
          sx={{ input: { color: 'white' } }}
        />
        <h5 className="userInfoLabel">Mobile Number</h5>
        <TextField
          type="number"
          value={mobileNumber} onChange={(evt) => { setMobileNumber(evt.target.value) }}
          variant="outlined"
          className="userInfoText"
          sx={{ input: { color: 'white' } }}
        />
        <div className="ChangeInfoButtonContainer">
          <Button variant="contained" className="saveChangeButton" onClick={handleChangeUserInfo}>Next</Button>
        </div>

      </div>
    </div>
  );
};