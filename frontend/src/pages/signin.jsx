import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { signup } from '../services/auth';

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
  let validate_and_set_mail = (val) => {
    let mailvalue = val;
    let mailerrr = '';

    if (mailvalue == "")
      mailerrr = 'required'
    else if (mailvalue.match(/@/) == null)
      mailerrr = '@ must be required'
    else if (/^[a-zA-Z0-9!#%^&*]{3,}@[a-z]{2,12}\.[a-z.]{2,}$/.test(mailvalue) == false)
      mailerrr = 'invalid mail';
    else
      mailerrr = ''

    setmail((pre) => { return { text: mailvalue, err: mailerrr } });
    if (mailerrr) return false;
    return true;

  }

  let validate_and_set_name = (val) => {
    let err = '';
    if (val == '') err = 'required';
    else if (val.length < 3) err = ' atleast 2 char';
    else err = '';
    setname({ text: val, err });
    if (err) return false;
    return true;
  }

  let validate_and_set_password = (val) => {
    let passwordval = val;
    let passworderr = '';

    if (passwordval == '')
      passworderr = 'required'
    else if (passwordval.length < 8)
      passworderr = 'atleast 8 charcter'
    else
      passworderr = ''

    setpassword({ text: passwordval, err: passworderr });
    if (passworderr) return false;
    return true;

  }

  let validate_and_set_cpassword = (val) => {
    let err = '';
    if (val == '') err = 'required'
    else if (val != password.text) {
      err = 'wrong confirm password';
    } else {
      if (password.err) err = password.err;
      else err = '';
    }
    setcpassword({ text: val, err });
    if (err) return false;
    return true;
  }


  let handleSignup = async (e) => {
    let three = validate_and_set_mail(e.target.mail.value)
    let four = validate_and_set_name(e.target.name.value)
    let two = validate_and_set_password(e.target.password.value)
    let one = validate_and_set_cpassword(e.target.cpassword.value);

    e.preventDefault();
    if (one && two && three && four) {

      let formData = {
        name: name.text,
        mail: mail.text,
        password: password.text
      }
      let id = toast.loading("signing up.");

      let data = await signup(formData);
      if (data.err) {
        toast.error(data.err, {
          id,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        return;
      }
      dispatch(loginAction(data.msg));
      localStorage.setItem('noteAuth', data.msg);
      navigate("/");
      toast.success("Signin successfully", {
        id,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }
  }
  return (
    <div className="formcontainer">
      {auth ? <Navigate to="/" /> :
        <div className="loginform">
          <h2>Create an account</h2>
          <form autoComplete='off' id="myform" onSubmit={handleSignup}>
            <div className="form_item">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" className={name.err && 'err'} value={name.text}
                onChange={(e) => validate_and_set_name(e.target.value)} />
              {name.err ? <span className='err_msg'>{name.err}</span> : null}

            </div>
            <div className="form_item">
              <label htmlFor="mail">Email</label>
              <input type="email" name="mail" id="mail" className={mail.err && 'err'} value={mail.text}
                onChange={(e) => validate_and_set_mail(e.target.value)} />
              {mail.err ? <span className='err_msg'>{mail.err}</span> : null}
            </div>
            <div className="form_item">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" className={password.err && 'err'} value={password.text} onChange={(e) => validate_and_set_password(e.target.value)} />
              {password.err ? <span className='err_msg'>{password.err}</span> : null}

            </div>
            <div className="form_item">
              <label htmlFor="cpassword">confirm Password</label>
              <input type="password" name="cpassword" id="cpassword" className={cpassword.err && 'err'} value={cpassword.text} onChange={(e) => validate_and_set_cpassword(e.target.value)} />
              {cpassword.err ? <span className='err_msg'>{cpassword.err}</span> : null}

            </div>
            <input type="submit" value="Signup" />

          </form>
          <div className="link">
            Have an account?
            <Link to="/login"> Login</Link>

          </div>
        </div>
      }
    </div>
  )
}

export default Signin