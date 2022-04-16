import React, { useEffect,useState } from "react";
import {Backdrop, CircularProgress,Paper,Typography,Pagination,Select,MenuItem,FormControl,InputLabel,IconButton} from "@mui/material"
import axios from "axios";
import {link} from "../Helpers/Constants";
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from '@mui/icons-material/Delete';
import './styling/myOrders.scss';
const MyOrders = (props) => {
const [orders,setOrders] = useState([]);
const [loading,setLoading] = useState(true);
const [currentPage,setCurrentPage] = useState(0);
const [status,setStatus] = useState("");
const [pageSize,setPageSize] = useState(15);
const [numberOfOrders,setNumberOfOrders] = useState(0);
const handlePagination = (e,value) => {
    setCurrentPage(value-1);
}
const getUsersOrders = async (id) =>{
    setLoading(true);
    const accessToken =await props.getAccessTokenSilently();
    axios.get(`${link}orders/getUsersOrders/${id}/${pageSize}/${currentPage}${status?`?status=${status}`:''}`,{headers:{Authorization:`Bearer ${accessToken}`}})
    .then(res=>{
        setOrders(res.data.data);
        setNumberOfOrders(res.data.size);
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
const deleteOrderHandler = async (orderId) =>{
    setLoading(true);
    const accessToken =await props.getAccessTokenSilently();
    axios.delete(`${link}orders/deleteOrder/${props.user.user_id}/${orderId}/${pageSize}/${currentPage}${status?`?status=${status}`:''}`,{headers:{Authorization:`Bearer ${accessToken}`}})
    .then(res=>{
        Swal.fire({
            title: 'Success',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok'
        })
        setOrders(res.data.data);
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
useEffect(()=>{
    if(props.user)
        getUsersOrders(props.user.user_id);
},[props.user,currentPage,pageSize,status])


  return (
    <div className="myOrdersContainer" > 
        <Typography variant="h5" className="myOrdersTitle">My Orders</Typography>
    <div className="headerContainer">
    <FormControl fullWidth>
    <InputLabel style={{color:"white"}}>Page Size</InputLabel>
        <Select className="statusFilter"
        onChange={(e)=>setPageSize(e.target.value)}
        >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        </Select>
    </FormControl>
    <FormControl fullWidth style={{justifySelf:"flex-end"}}>
    <InputLabel style={{color:"white"}}>Status</InputLabel>
        <Select className="statusFilter" 
        onChange={(e)=>setStatus(e.target.value)}
        >
        <MenuItem >None</MenuItem>
        <MenuItem value={"pending"}>Pending</MenuItem>
        <MenuItem value={"paid"}>Paid</MenuItem>
        <MenuItem value={"paymentDeclined"}>Payment Declined</MenuItem>
        </Select>
    </FormControl>
    <IconButton>

    </IconButton>
    </div>

        <div className="myOrders">
            {orders.map((order)=>(
            <Paper className="orderContainer" key={uuidv4()}>
                <IconButton className="deleteButton" onClick={()=>deleteOrderHandler(order._id)}>
                    <DeleteIcon className="img"/>
                </IconButton>
                <div className="orderRow">
                <Typography className="title"># {order.number}</Typography>
                <div className={`status ${order.status}`}>
                    <Typography className="statusTypography">
                {order.status=="paymentDeclined"?"Payment Declined":order.status}
                    </Typography></div>

                </div>
               <div className="orderRow">
               <Typography className="orderNumber">{order.address}</Typography>
                <Typography className="orderNumber">{"$ "+order.totalPrice}</Typography>
               </div>
            </Paper>)
            )}
        {orders && orders.length!==0 && <Pagination disabled={(numberOfOrders==0 || loading )} page={currentPage} onChange={handlePagination} variant="outlined"  className="ordersPagination" count={Math.ceil(numberOfOrders/pageSize)} />}

        </div>   
        <Backdrop className="backdrop" open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>
  );
};

export default MyOrders;