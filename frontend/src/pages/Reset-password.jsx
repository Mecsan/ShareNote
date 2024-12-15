import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../services/auth';
import { logout } from '../redux/slices/authSlice';
import { setSections } from '../redux/slices/sectionSlice';
import { setNotes } from '../redux/slices/noteSlice';
import toast from 'react-hot-toast';

function ResetPassword() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);

    let [oldPassword, setOldPassword] = useState({
        text: "",
        err: ""
    })
    let [password, setpassword] = useState({
        text: "",
        err: ""
    })
    let [cpassword, setcpassword] = useState({
        text: "",
        err: ""
    })

    let [errVisible, setErrVisible] = useState(false);

    useEffect(() => {
        validateBody();
    }, [oldPassword.text, password.text, cpassword.text]);

    let validateBody = () => {
        let oldPasswordValue = oldPassword.text;
        let oldPasswordErr = '';

        if (oldPasswordValue == "")
            oldPasswordErr = 'please enter your old password!'
        else
            oldPasswordErr = ''
        setOldPassword((pre) => { return { ...pre, err: oldPasswordErr } });

        let passwordval = password.text;
        let passworderr = '';

        if (passwordval == '')
            passworderr = "password can't be empty!"
        else if (passwordval.length < 8)
            passworderr = 'password too short!'
        else if (passwordval.length > 15)
            passworderr = 'password too long!'
        else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/.test(passwordval) == false)
            passworderr = 'password too weak!'
        else
            passworderr = ''
        setpassword((pre) => { return { ...pre, err: passworderr } });

        let cpasswordval = cpassword.text;
        let cpassworderr = '';
        if (cpasswordval == '') cpassworderr = 'confirm password is required!'
        else if (cpasswordval != password.text) {
            cpassworderr = 'confirm password not matching!';
        } else {
            if (password.err) cpassworderr = passworderr;
            else cpassworderr = '';
        }
        setcpassword((pre) => { return { ...pre, err: cpassworderr } });
    }

    let handleLogin = async (e) => {
        e.preventDefault();
        if (!errVisible) {
            setErrVisible(true);
        }
        validateBody();
        let isValid = (oldPassword.err == '' && password.err == '' && cpassword.err == '');

        if (isValid) {
            let formData = {
                oldPassword: oldPassword.text,
                password: password.text
            }

            let id = toast.loading("Reseting password...");
            let data = await resetPassword(formData, token);
            if (data.err) {
                toast.error(data.err, {
                    id
                });
                return;
            }

            navigate("/login");
            dispatch(setNotes([]));
            dispatch(setSections([]));
            dispatch(logout());
            localStorage.removeItem('noteAuth');
            toast.success("Password reset successfully", {
                id
            })
        }
    }


    return (
        <div className="formcontainer">
            <div className="loginform">
                <h2>Reset your password</h2>
                <form autoComplete='off' id="myform" onSubmit={handleLogin}>
                    <div className="form_item">
                        <label htmlFor="old-password">Old Password</label>
                        <input type="password" name="old-password" id="old-password"
                            onChange={(e) => setOldPassword((pre) => { return { ...pre, text: e.target.value } })}
                            value={oldPassword.text}
                            className={errVisible && oldPassword.err && 'err'}
                        />
                        {errVisible && oldPassword.err ? <span className='err_msg'>{oldPassword.err}</span> : null}
                    </div>
                    <div className="form_item">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password"
                            onChange={(e) => setpassword((pre) => { return { ...pre, text: e.target.value } })}
                            className={errVisible && password.err && 'err'}
                            value={password.text} />
                        {errVisible && password.err ? <span className='err_msg'>{password.err}</span> : null}
                    </div>
                    <div className="form_item">
                        <label htmlFor="password">Confirm password</label>
                        <input type="password" name="cpassword" id="cpassword"
                            onChange={(e) => setcpassword((pre) => { return { ...pre, text: e.target.value } })}
                            className={errVisible && cpassword.err && 'err'}
                            value={cpassword.text} />
                        {errVisible && cpassword.err ? <span className='err_msg'>{cpassword.err}</span> : null}
                    </div>
                    <input type="submit" value="Reset" />
                </form>
            </div>
        </div>
    )
}

export default ResetPassword