import React, { useEffect ,useState} from "react";
import Login from './Components/Auth/Login'
import Logout from './Components/Auth/Logout'
import Profile from './Components/Profile'
import Home from './Components/Home'
import Navbar from './Components/General_Components/Navbar'
import {Route,Routes,BrowserRouter,useSearchParams} from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios"
import {link} from "./Helpers/Constants";
import Swal from 'sweetalert2';
import './App.scss';

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile,setIsMobile] = useState(false);
  const { loginWithRedirect } = useAuth0();
  
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  };
  const getUserInfo = async () => {
    try {
      const domain='dev-sbjztdyr.us.auth0.com'
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "read:current_user update:users update:clients update:current_user_metadata update:app_metadata",
      });
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      axios.get(userDetailsByIdUrl, {headers:{Authorization:`Bearer ${accessToken}`}})
      .then(res=>{
        const tempUser={...res.data}
        tempUser.picture=user.picture
        setUserMetadata(tempUser);
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }
  };
  useEffect(() =>{
    window.addEventListener('resize', handleWindowSizeChange);
  },[]);
  useEffect(() =>{
    setIsMobile(width<=768);
  },[width]);

  useEffect(() => {
    if(user&&isAuthenticated){
      getUserInfo();
    }
    
  }, [getAccessTokenSilently, user?.sub]);
  return (
    <div className="App">
              
        <Navbar user={userMetadata} handleLogin={loginWithRedirect} />
        <div className="pageContent">
        <Routes>
      
          <Route
              exact
              path="/Home"
              element={(props) => <Home {...props} language={"en"}/>}
          />
          <Route
              exact
              path="/Profile"
              element={<Profile isMobile={isMobile} user={userMetadata} getAccessTokenSilently={getAccessTokenSilently} setUserMetadata={setUserMetadata}  language={"en"}/>}
          />
        </Routes>
        </div>

    </div>
  );
}

export default App;
