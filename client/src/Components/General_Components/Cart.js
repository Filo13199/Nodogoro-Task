import { Paper, Typography,Button } from "@mui/material";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import './styles/cart.scss';
export default function Cart(props) {

    const products=[{name:'Product 1'},{name:'Product 2'},{name:'Product 3'},{name:'Product 4'},{name:'Product 5'},{name:'Product 6'},{name:'Product 7'},{name:'Product 8'},{name:'Product 9'}]
  return (
    <div className="myCart">
      <div className="myCartContainer">
      <Typography className="title">
            My Cart
        </Typography>
        <div className="myCartProductListContainer">
        {products.map((product,Index) => {
          return (
              <Paper key={uuidv4()}  className="myCartProductContainer" elevation={4} >
                        <img className="productImage" src="https://res.cloudinary.com/dgiusyfrn/image/upload/v1649931428/Pngtree_healthcare_products_5395521_qfr87v.png" alt=""/>
                    <div className="myCartProductInfoContainer">
                        <Typography className="name">
                            {product.name}
                        </Typography>
                        <Typography className="price">
                            EGP 100
                        </Typography>
                    </div>
              </Paper>
          )
    })}
        </div>
      </div>

        <div className="orderSummaryContainer">
            <div className="orderSummaryAndTitleContainer">
            <Typography className='orderSummaryTitle'> Order Summary </Typography>
            <div className="orderSummary">
                    <Typography className="orderSummaryItemTitle">
                        Subtotal
                    </Typography>
                    <Typography className="orderSummaryItemValue">
                        EGP 900
                    </Typography>
            </div>
            <div className="orderSummary">
                    <Typography className="orderSummaryItemTitle">
                        Shipping
                    </Typography>
                    <Typography className="orderSummaryItemValue">
                        EGP 100
                    </Typography>
            </div>
            <div className="orderSummary">
                    <Typography className="orderSummaryItemTitle">
                        Total
                    </Typography>
                    <Typography className="orderSummaryItemValue">
                        EGP 1000
                    </Typography>
            </div>
            </div>
            <div className="buttonContainer">
            <Button variant="contained" className="saveChangeButton" onClick={props.handleNext}>Next</Button>
            </div>
        </div>
        </div>
  );
}
