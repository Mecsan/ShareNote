import React, { useContext, useEffect, useRef, useState } from 'react';
import { ListItem, ListItemText, ListItemButton, ListItemIcon, Divider, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import User from './user';
import { MainContex } from '../contex/mainContex';
import { AuthContex } from '../contex/AuthContex';
import { LinkContex } from '../contex/LinkContex';
import HouseIcon from '@mui/icons-material/House';
import MenuIcon from '@mui/icons-material/Menu';

import { sectionApi } from '../config/apis';
import toast from 'react-hot-toast';
import { createSection, getSections } from '../services/section';


function Nav() {

    const { setactive, dispatch } = useContext(MainContex);

    const { setauth, auth } = useContext(AuthContex);

    const { links, dispatchLink } = useContext(LinkContex);

    let Navigate = useNavigate();

    let handleLogout = () => {
        let ok = confirm("are u sure want to logout?");

        if (ok) {
            localStorage.removeItem('noteAuth');
            toast.success('Logout successed', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
            dispatch({ type: "SET_NOTE", payload: [] });
            dispatchLink({ type: "SET_LINK", payload: [] })
            setauth(null);
            setactive(null);
            Navigate("/login");
        }
    }


    let getsections = async () => {
        let data = await getSections(auth);
        if (data.err) return;
        dispatchLink({ type: "SET_LINK", payload: data.msg })
    }

    useEffect(() => {
        getsections();
    }, [])


    let [isAdd, setIsAdd] = useState(false);
    let [add, setadd] = useState("");

    let opennav = () => {
        document.querySelector(".nav").classList.toggle('open-nav-bar')
    }

    let addsection = async () => {
        if (add == "") {
            toast.error("can't be empty", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
            return;
        }

        let tid = toast.loading("adding section");

        let data = await createSection(auth, { title: add });
        if (data.msg) {
            dispatchLink({ type: "ADD_LINK", payload: data.msg });
            Navigate("/" + data.msg._id);

            toast.success('section added', {
                id: tid,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
        opennav();
        setIsAdd(false);
        setadd("");
    }


    return (
        <div className="left" onClick={(e) => {
            if (e.target.className == 'overlay') {
                opennav();
            }
        }}>
            <div className="opennav" onClick={opennav}>
                <MenuIcon style={{ color: "var(--primary-color)", fontSize: "2rem" }} />
            </div>

            <div className='nav'>
                <div className="overlay"></div>
                <div className="navbar">
                    <ul className="flex">
                        <User opennav={opennav} />
                        <Divider />

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => Navigate("/")}>
                                <ListItemText primary="Home" style={{ color: location.pathname == "/" ? "#5469d4" : "black" }} />
                                <ListItemIcon>
                                    <HouseIcon style={{ color: location.pathname == "/" ? "#5469d4" : "grey" }} />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        <Divider />

                        <ListItem disablePadding >
                            <ListItemButton onClick={() => setIsAdd(!isAdd)}>
                                <ListItemText primary="Add" style={{ color: "black" }} />
                                <ListItemIcon>
                                    <AddBoxIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        {
                            isAdd &&
                            <ListItem disablePadding >
                                <ListItemButton >
                                    <TextField
                                        placeholder='Name'
                                        size="small"
                                        variant="standard"
                                        value={add}
                                        onChange={(e) => setadd(e.target.value)}
                                    />
                                    <ListItemIcon onClick={addsection}>
                                        <CheckBoxIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>

                        }
                        <Divider />
                        {
                            links ? links.map((link) => {
                                return (
                                    <ListItem key={link._id} disablePadding onClick={() => {
                                        opennav();
                                        Navigate('/' + link._id)
                                    }}>
                                        <ListItemButton>
                                            <ListItemText primary={link.title} style={link._id == location.pathname.substring(1) ? { color: "rgb(84, 105, 212)" } : { color: "black" }} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }) : null
                        }

                        <ListItem disablePadding style={{ paddingTop: '30px' }}>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemText primary="Logout" style={{ color: "black" }} />
                                <ListItemIcon>
                                    < LogoutIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default Nav