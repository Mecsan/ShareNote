import React, { useContext, useEffect, useState } from 'react'
import Switch from "react-switch";
import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Divider, TextField } from '@mui/material';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { MainContex } from '../contex/mainContex';
import { setting } from '../config/apis';
import HouseIcon from '@mui/icons-material/House';


function User({ opennav }) {

    let navigate = useNavigate();
    let { user, setuser, notis } = useContext(MainContex)

    let changeDate = async () => {

        let res = await fetch(setting, {
            method: "POST",
            headers: {
                'authorization': localStorage.getItem('taskAuth'),
                'content-type': "application/json"
            },
            body: JSON.stringify({ isDate: !user.isDate })
        })
        let data = await res.json();
        if (data.success) {
            setuser(data.msg);
        }
    }
    let changeTitle = async () => {

        let res = await fetch(setting, {
            method: "POST",
            headers: {
                'authorization': localStorage.getItem('taskAuth'),
                'content-type': "application/json"
            },
            body: JSON.stringify({ isTitle: !user.isTitle })
        })
        let data = await res.json();
        if (data.success) {
            setuser(data.msg);
        }
    }

    return (
        <>
            {user &&
                <div className="user">
                    <div className="name">
                        <span className='pre'>welcome</span>
                        <div className="some">
                            {user.name}
                        </div>
                        <span style={{ color: "grey", fontSize: "0.85rem" }}>{user.mail}</span>
                    </div>
                    <div className="setting">
                        <p>see title</p>
                        <div className="small">
                            <Switch checked={user.isTitle} onColor='#5469d4' uncheckedIcon={false} checkedIcon={false} onChange={changeTitle} />
                        </div>
                    </div>
                    <div className="setting">
                        <p>see date</p>
                        <div className="small">
                            <Switch checked={user.isDate} onColor='#5469d4' checkedIcon={false} uncheckedIcon={false} onChange={changeDate} />
                        </div>
                    </div>
                    <div className="notification">
                        <HouseIcon onClick={()=>{
                            navigate("/")
                        }} style={{ color: "#5469d4" }} />
                        <div className="noti_icon" onClick={() => {
                            opennav();
                            navigate("/notification")
                        }}>
                            <Badge badgeContent={notis?.filter((noti) => noti.hasNoticed == false).length} color={'error'}>
                                <NotificationsIcon style={{ color: "#5469d4" }} />
                            </Badge>
                        </div>
                    </div>
                    <Divider />
                </div>
            }
        </>

    )
}

export default User