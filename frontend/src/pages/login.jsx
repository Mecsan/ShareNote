import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, status } from '../redux/slices/authSlice';

function Login() {
  let navigate = useNavigate();
  let { authStatus } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  let [mail, setmail] = useState({
    text: "",
    err: ""
  })
  let [password, setpassword] = useState({
    text: "",
    err: ""
  })
  let [errVisible, setErrVisible] = useState(false);

  useEffect(() => {
    validateBody();
  }, [mail.text, password.text]);

  let validateBody = () => {
    let mailvalue = mail.text;
    let mailerrr = '';

    if (mailvalue == "")
      mailerrr = 'email is required!'
    else if (/^[a-zA-Z0-9!#%^&*]{3,}@[a-z]{2,12}\.[a-z.]{2,}$/.test(mailvalue) == false)
      mailerrr = 'invalid email!';
    else
      mailerrr = ''
    setmail((pre) => { return { ...pre, err: mailerrr } });

    let passwordval = password.text;
    let passworderr = '';

    if (passwordval == '')
      passworderr = 'password is required!'
    else if (passwordval.length < 8)
      passworderr = 'password too short!'
    else if (passwordval.length > 15) 
      passworderr = 'password too long!'
    else if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/.test(passwordval) == false)
      passworderr = 'password too weak!'
    else
      passworderr = ''
    setpassword((pre) => { return { ...pre, err: passworderr } });
  }

  let handleLogin = async (e) => {
    e.preventDefault();
    if (!errVisible) {
      setErrVisible(true);
    }
    validateBody();
    let isValid = (mail.err == '' && password.err == '');

    if (isValid) {
      let formData = {
        mail: mail.text,
        password: password.text
      }

      let id = toast.loading("logging in..");
      let data = await login(formData);
      if (data.err) {
        toast.error(data.err, {
          id
        });
        return;
      }

      navigate("/");
      dispatch(loginAction(data.msg));
      localStorage.setItem('noteAuth', data.msg);
      toast.success("Login successfully", {
        id
      })
    }
  }

  if (authStatus == status.AUTH) {
    return (<Navigate to="/" />)
  }

  return (
    <div className="formcontainer">

      <div className="loginform">
        <h2>Log in to your  account</h2>
        <form autoComplete='off' id="myform" onSubmit={handleLogin}>
          <div className="form_item">
            <label htmlFor="mail">Email</label>
            <input type="text" name="mail" id="mail"
              onChange={(e) => setmail((pre) => { return { ...pre, text: e.target.value } })}
              value={mail.text} 
              className={errVisible && mail.err && 'err'}
            />
            {errVisible && mail.err ? <span className='err_msg'>{mail.err}</span> : null}
          </div>
          <div className="form_item">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password"
              onChange={(e) => setpassword((pre) => { return { ...pre, text: e.target.value } })}
              className={errVisible && password.err && 'err'}
              value={password.text} />
            {errVisible && password.err ? <span className='err_msg'>{password.err}</span> : null}
          </div>
          <input type="submit" value="Login" />
        </form>
        <div className="link">
          Don't have an account?
          <Link to="/signup"> Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login