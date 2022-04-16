import { Paper, Typography } from "@mui/material";
import React from "react";
import './styles/orderPlaced.scss';
export default function OrderPlaced(props) {

  return (
        <div className="orderPlacedContainer">
            <Typography variant="h5" className="orderPlacedTitle">
                Order Placed
            </Typography>
            <Typography variant="h6" className="orderPlacedSubTitle">
                Thank you for your order, click <a href="/myOrders"> here</a> to view your orders.
            </Typography>
        </div>
  );
}
