import React, { useEffect, useState } from "react";
import axios from "axios";
import { link } from "../Helpers/Constants";
import Swal from 'sweetalert2';
import Stepper from './General_Components/Stepper'
import './styling/checkout.scss'
import UserInfo from "./General_Components/UserInfo";
import Cart from "./General_Components/Cart";
import {Backdrop,CircularProgress} from "@mui/material"
import {Elements} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from './General_Components/CheckoutForm';
import OrderPlaced from './General_Components/OrderPlaced'
const stripeAppearance = {
  theme: 'stripe',
};
const Checkout = (props) => {
  const stripePromise = loadStripe("pk_test_51KoSgiLqfestWMlshW8AUYveh27IWCdZCfZy5NFhaHcgh2hx8CKBngIjzYlnz3IZqciT8OAd4w9II7eA5F0ZxnYx001cZ1gl61");
  const [user, setUser] = useState(null);
  const [address,setAddress] = useState("");
  const [givenName, setFirstName] = useState("");
  const [familyName, setLastName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading,setLoading] = useState(false);

  const placeOrder =async ()=>{
    setLoading(true);
    const accessToken =await props.getAccessTokenSilently();
    const reqBody = {
      address:address,
      userName:givenName+" "+familyName,
      phoneNumber:phoneNumber,
      totalPrice:1000,
      userId:user.user_id
    }
    axios.post(link+"orders/placeOrder",reqBody,{headers:{Authorization:`Bearer ${accessToken}`}})
    .then(res=>{
      setActiveStep(2);
      setClientSecret(res.data.clientSecret);
      setLoading(false);
    })
    .catch(err=>{
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: err.response&&err.response.data&&err.response.data.error?err.response.data.error:'Something Went Wrong',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
  }
  const initializeStates = (user)=>{
    setFirstName(user.given_name);
    setLastName(user.family_name);
    if(user.user_metadata){
      setAddress(user.user_metadata.address);
      setPhoneNumber(user.user_metadata.mobileNumber);
    }
    setUser(user);
  }
  const getQueryParams = () =>{
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const queryParams = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      queryParams[pair[0]] = decodeURIComponent(pair[1]);
    }
    return queryParams;
  }
  const next = ()=>{
    if(activeStep==0){
      setActiveStep(1);
    }
    else if(activeStep==1){
     return placeOrder();
    }
  }

  useEffect(() => {
    const queryParams = getQueryParams();
    if(queryParams && queryParams.payment_intent){
      setActiveStep(3);
    }
  }, []);
  useEffect(() => {
    if (props.user){
      initializeStates(props.user);
    }
  }, [props.user]);
  useEffect(() => {
    if (user){
      initializeStates(user);
    }
  }, [user]);

  return (
    <div className="checkoutContainer">
        <Stepper steps={["User Info","Place Order","Payment","Done !"]} activeStep={activeStep} />
        {activeStep==0&&<UserInfo 
        user={user} 
        handleNext={next} 
        givenName={givenName}
        familyName={familyName}
        address={address}
        phoneNumber={phoneNumber}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setAddress={setAddress}
        setPhoneNumber={setPhoneNumber}
        setUser={setUser}
        getAccessTokenSilently={props.getAccessTokenSilently}
        />}
        {activeStep==1&&<Cart user={user} handleNext={next}/>}
        {activeStep==2&& clientSecret&&
        <Elements options={{stripeAppearance,clientSecret}} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>}
        {activeStep==3&&<OrderPlaced />}
        <Backdrop open={loading}>
          <CircularProgress />
        </Backdrop>
    </div>
  );
};

export default Checkout;