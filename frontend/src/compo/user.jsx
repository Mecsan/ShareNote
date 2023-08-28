import React, { useContext, useEffect, useState } from 'react'
import Switch from "react-switch";
import { setting } from '../config/apis';
import { AuthContex } from '../contex/AuthContex';
import { changeSetting } from '../services/auth';


function User() {

    let { user, setuser, auth } = useContext(AuthContex)

    let changeDate = async () => {
        let data = await changeSetting(auth, { isDate: !user.isDate })
        if (data.err) return;
        setuser(data.msg);
    }
    let changeTitle = async () => {
        let data = await changeSetting(auth, { isDesc: !user.isDesc });
        if (data.err) return;
        setuser(data.msg);
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