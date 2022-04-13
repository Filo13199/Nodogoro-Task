import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, Divider, Button, Avatar, Typography, IconButton, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './styles/sideBar.scss';
import axios from 'axios';
import { link } from '../../Helpers/Constants'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function SideBar(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(props.user);
    const [anchorEl, setAnchorEl] = useState(null);



    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isMenuOpen = Boolean(anchorEl);
    return (
        <div
            role="presentation"
            className='sideBarContainer'>
            <div>
                <div className="avatarLoginContainer">
                    <Avatar
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        src={props.user ? props.user.picture : '/media/profile.png'}
                        alt={props.user ? props.user.nickname : ""}
                        className="userAvatar"
                    />
                    <div className="sideBarUnloggedUserContainer">
                        {user ?
                            <IconButton onClick={() => navigate('/checkout', { replace: true })("/checkout")} disabled={!props.user}>
                                <Badge badgeContent={props.cart ? props.cart.length : 0} color="secondary">
                                    <ShoppingCartIcon className="navbarIcon" />
                                </Badge>
                            </IconButton>
                            :
                            <div className="sideBarItem" onClick={props.handleLogin}>
                                <LoginIcon className='sideBarItemIcon' />
                                <Typography className="sideBarLoginText">Login</Typography>
                            </div>
                        }
                    </div>
                </div>
                {props.user &&
                    <React.Fragment>
                        <div className="nameBarContainer">
                            <Typography className="sideBarName">{(props.user && props.user.nickname) ? props.user.nickname : ""} {(props.user && props.user.lastName) ? props.user.lastName : ""}</Typography>
                        </div>
                    </React.Fragment>
                }
                <Divider />

                <div className="sideBarItem" onClick={() => { navigate('/Home', { replace: true }); props.toggleDrawer(); }}>
                    <HomeOutlinedIcon className='sideBarItemIcon' />
                    <Typography className="sideBarItemText">Home</Typography>
                </div>

                <div className="sideBarItem" onClick={() => { if (props.user) { navigate('/Profile', { replace: true }); props.toggleDrawer(); } }}>
                    <PersonOutlineOutlinedIcon className='sideBarItemIcon' />
                    <Typography className="sideBarItemText">Profile</Typography>
                </div>

                <Divider />

                <div className="sideBarItem" onClick={() => { navigate('/shop', { replace: true }); props.toggleDrawer(); }}>
                    <StorefrontIcon className='sideBarItemIcon' />
                    <Typography className="sideBarItemText">Shop</Typography>
                </div>
            </div>
        </div>
    );
}