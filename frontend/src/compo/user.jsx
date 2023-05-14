import React, { useContext, useEffect, useState } from 'react'
import Switch from "react-switch";
import { setting } from '../config/apis';
import { AuthContex } from '../contex/AuthContex';


function User() {

    let { user, setuser } = useContext(AuthContex)

    let changeDate = async () => {

        let res = await fetch(setting, {
            method: "POST",
            headers: {
                'authorization': localStorage.getItem('noteAuth'),
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
                'authorization': localStorage.getItem('noteAuth'),
                'content-type': "application/json"
            },
            body: JSON.stringify({ isDesc: !user.isDesc })
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
                        <p>see description</p>
                        <div className="small">
                            <Switch checked={user.isDesc} onColor='#5469d4' uncheckedIcon={false} checkedIcon={false} onChange={changeTitle} />
                        </div>
                    </div>
                    <div className="setting">
                        <p>see date</p>
                        <div className="small">
                            <Switch checked={user.isDate} onColor='#5469d4' checkedIcon={false} uncheckedIcon={false} onChange={changeDate} />
                        </div>
                    </div>

                </div>
            }
        </>

    )
}

export default User