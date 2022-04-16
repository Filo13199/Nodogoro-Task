import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";
ReactDOM.render(
  <Auth0Provider
    domain="dev-sbjztdyr.us.auth0.com"
    clientId="QFEIszQqrMlGEI9ZyNkzVvF6BNnmltmz"
    redirectUri={"https://nodogoro-ecommerce.herokuapp.com/"}
    audience="https://dev-sbjztdyr.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata update:users"
  > 
  <BrowserRouter>
    <App />
    </BrowserRouter>

  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
