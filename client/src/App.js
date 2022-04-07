import React, { useEffect ,useState} from "react";
import Login from './Components/Auth/Login'
import Logout from './Components/Auth/Logout'
import Profile from './Components/Profile'
import Home from './Components/Home'
import Navbar from './Components/General_Components/Navbar'
import {Route,Routes,BrowserRouter} from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios"
import {link} from "./Helpers/Constants";
import Swal from 'sweetalert2';
import './App.scss';

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const getUserInfo = async () => {
  
    try {
      const domain='dev-sbjztdyr.us.auth0.com'
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "read:current_user",
      });
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      axios.get(userDetailsByIdUrl, {headers:{Authorization:`Bearer ${accessToken}`}})
      .then(res=>{
        setUserMetadata(res.data);
      })
      .catch(err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      })
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    if(user&&isAuthenticated){
      getUserInfo();
    }
    
  }, [getAccessTokenSilently, user?.sub]);
  return (
    <div className="App">

      <header className="App-header">
      <Navbar user={userMetadata}/>
    </header>
    <Login />
        <Logout />
        <BrowserRouter>
          <Routes>
          <Route
              exact
              path="/Home"
              render={(props) => <Home {...props} language={"en"}/>}
            />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
