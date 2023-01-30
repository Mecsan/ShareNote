import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContex } from '../contex/AuthContex';
import { login } from '../config/apis';
import toast from 'react-hot-toast';

function Login() {
  let navigate = useNavigate();
  const {auth, setauth } = useContext(AuthContex)

  let [mail, setmail] = useState({
    text: "",
    err: ""
  })
  let [password, setpassword] = useState({
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

  let handleLogin = async (e) => {
    let one = validate_and_set_mail(mail.text);
    let two = validate_and_set_password(password.text);
    e.preventDefault();
    if (one && two) {

      let formData = {
        mail: mail.text,
        password: password.text
      }

      let id = toast.loading("logging in..");

      let res = await fetch(login, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      let data = await res.json();

      if (data.success) {
        setauth(data.msg);
        localStorage.setItem('taskAuth', data.msg);
        toast.success("Login successfully", {
          id,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        })
        navigate("/");
      } else {
        toast.error(data.msg, {
          id,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        });
      }

    }
  }

  return (
    <div className="user_ex">
      {auth && <Navigate to="/"/>}
      <div className="user_back">


        <div className="formcontainer">

          <div className="loginform">
            <h2>Log in to your  account</h2>
            <form autoComplete='off' id="myform" onSubmit={handleLogin}>
              <div className="form_item">
                <label htmlFor="mail">Email</label>
                <input type="text" name="mail" id="mail"
                  onChange={(e) => validate_and_set_mail(e.target.value)}
                  value={mail.text} className={mail.err && 'err'}
                />
                {mail.err ? <span className='err_msg'>{mail.err}</span> : null}
              </div>
              <div className="form_item">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password"
                  onChange={(e) => validate_and_set_password(e.target.value)
                  }
                  className={password.err && 'err'}
                  value={password.text} />
                {password.err ? <span className='err_msg'>{password.err}</span> : null}
              </div>
              <input type="submit" value="Login" />
            </form>
            <div className="link">
              Don't have an account?
              <Link to="/signup"> Sign up</Link>

            </div>
          </div>

        </div>
      </div>
    </div>


  )
}

export default Login