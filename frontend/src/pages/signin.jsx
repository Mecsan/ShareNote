import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { signup } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login, status } from '../redux/slices/authSlice';

function Signin() {

  let navigate = useNavigate();
  let { authStatus } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  let [name, setname] = useState({
    text: "",
    err: ""
  })
  let [mail, setmail] = useState({
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
  }, [name.text, mail.text, password.text, cpassword.text]);

  let validateBody = () => {
    let namevalue = name.text;
    let nameerr = '';
    if (namevalue == '') nameerr = 'name is required!';
    else if (namevalue.length < 3) nameerr = 'name is too short!';
    else nameerr = '';
    setname((pre) => { return { ...pre, err: nameerr } });

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
      if (password.err) cpassworderr = password.err;
      else cpassworderr = '';
    }
    setcpassword((pre) => { return { ...pre, err: cpassworderr } });
  }

  let handleSignup = async (e) => {
    e.preventDefault();

    if (!errVisible) setErrVisible(true);
    let isValid = (name.err == '' && mail.err == '' && password.err == '' && cpassword.err == '');
    if (isValid) {

      let formData = {
        name: name.text,
        mail: mail.text,
        password: password.text
      }
      let id = toast.loading("signing up.");
      let data = await signup(formData);
      console.log(data)
      if (data.err) {
        toast.error(data.err, {
          id
        })
        return;
      }

      dispatch(login(data.msg));
      localStorage.setItem('noteAuth', data.msg);
      navigate("/");
      toast.success("Signin successfully", {
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
        <h2>Create an account</h2>
        <form autoComplete='off' id="myform" onSubmit={handleSignup}>
          <div className="form_item">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" className={errVisible && name.err && 'err'} value={name.text}
              onChange={(e) => setname((pre) => { return { ...pre, text: e.target.value } })} />
            {errVisible && name.err ? <span className='err_msg'>{name.err}</span> : null}

          </div>
          <div className="form_item">
            <label htmlFor="mail">Email</label>
            <input type="email" name="mail" id="mail" className={errVisible && mail.err && 'err'} value={mail.text}
              onChange={(e) => setmail((pre) => { return { ...pre, text: e.target.value } })} />
            {errVisible && mail.err ? <span className='err_msg'>{mail.err}</span> : null}
          </div>
          <div className="form_item">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className={errVisible && password.err && 'err'} value={password.text} onChange={(e) => setpassword((pre) => { return { ...pre, text: e.target.value } })} />
            {errVisible && password.err ? <span className='err_msg'>{password.err}</span> : null}

          </div>
          <div className="form_item">
            <label htmlFor="cpassword">confirm Password</label>
            <input type="password" name="cpassword" id="cpassword" className={errVisible && cpassword.err && 'err'} value={cpassword.text} onChange={(e) => setcpassword((pre) => { return { ...pre, text: e.target.value } })} />
            {errVisible && cpassword.err ? <span className='err_msg'>{cpassword.err}</span> : null}

          </div>
          <input type="submit" value="Signup" />

        </form>
        <div className="link">
          Have an account?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signin