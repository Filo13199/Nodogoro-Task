import React ,{useEffect,useState} from 'react';
import {Drawer, Avatar, Typography,IconButton,Badge,Menu,MenuItem} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth0 } from "@auth0/auth0-react";
import {m} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./styles/navbar.scss"

const Navbar = (props) => {
  const navigate=useNavigate();
  const {loginWithRedirect ,logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(false);
  const [scrolled,setScrolled] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    window.addEventListener('scroll',handleScroll)
  })
  const handleScroll=() => {
    const offset=window.scrollY;
    if(offset > 0){
      setScrolled(true);
    }
    else{
      setScrolled(false);
    }
}
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setMobileAnchorEl(!mobileAnchorEl);
  };
  let navbarClasses=['navContainer'];
  if(scrolled){
    navbarClasses.push('sticky');
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      style={{marginTop:"3rem"}}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem  onClick={()=>{
        handleMenuClose()
        navigate("/Profile",{replace:true})}}>Profile</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>

    </Menu>
  );  
  return (
    <nav className={navbarClasses.join(" ")} ref={props.navBarRef}>
 <div className="navbarContainer">
 <div className='info'>
   <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
       <MenuIcon fontSize="large" className="navBurgerMenu"/>
   </IconButton>
 <Drawer elevation={5} anchor='left' open={mobileAnchorEl} onClose={toggleDrawer}>
   <SideBar
   cart={props.cart}
   logout={logout}
   toggleDrawer={toggleDrawer}
   user={props.user}
   handleLoginOpen={props.handleLoginOpen}
   handleLogin={props.handleLogin}
   />
   </Drawer>
 </div>
 <ul>
   <li className="hide">
     <div/>
     <Link to="/Home" className="generalLink" >Home</Link>
     <m.div key="Home" style={{backgroundColor:'#1D353A'}} className="line" transition={{duration:0.25}} initial={{width:'0%'}} animate={{width:props.pathname==="/clinic"?'100%':'0%'}}/>
     </li>
   <li className="hide">
     <div/>
     <Link to="/shop" className="generalLink" >Shop</Link>
     <m.div key="Market Place" style={{backgroundColor:'#97B2A3'}} className="line" transition={{duration:0.25}} initial={{width:'0%'}} />
     </li>
     <li className="navShopingCart"> 
       {props.user&&
       <IconButton onClick={()=>navigate("/checkout",{replace:true})} color="inherit">
         <Badge badgeContent={props.cart?props.cart.length:0} color="secondary">
           <ShoppingCartIcon className="navbarIcon"/>
         </Badge>
       </IconButton>
       }
     </li>
   <li>
     <div className="navLogin" onClick={props.user?handleProfileMenuOpen:()=>{}}>
     {props.user&&
     <Avatar
     aria-label="account of current user"
     aria-controls="primary-search-account-menu"
     aria-haspopup="true"
     color="inherit"
     src={props.user.picture?props.user.picture:'/media/default_profile_picture.png'}
     alt={props.user.nickname||""}
     className="userAvatar"
     >
     </Avatar>
     }
     {props.user?
     isMenuOpen?
     <ExpandLessIcon className="expandIcon" />
     :
     <ExpandMoreIcon className="expandIcon" />
     :
     <IconButton edge="start" color="inherit" aria-label="menu" onClick={props.handleLogin}>
       <LoginIcon fontSize="large" className="loginButton"/>
     </IconButton>
     }
     </div>
     </li>

 </ul>
 </div>

 {renderMenu}

</nav>
  );
};
export default Navbar;
