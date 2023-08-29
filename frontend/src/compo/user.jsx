import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Switch from "react-switch";
import { setUser } from '../redux/slices/authSlice';
import { changeSetting } from '../services/auth';

function User() {

    const { user, token } = useSelector(state => state.auth);
    let dispatch = useDispatch();

    let changeDate = async () => {
        let data = await changeSetting(token, { isDate: !user.isDate })
        if (data.err) return;
        dispatch(setUser(data.msg));
    }

    let changeTitle = async () => {
        let data = await changeSetting(token, { isDesc: !user.isDesc });
        if (data.err) return;
        dispatch(setUser(data.msg));
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