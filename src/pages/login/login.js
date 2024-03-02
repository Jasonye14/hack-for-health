import { useState } from "react";
import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import bgpicture from '../../images/BGIMGBB.png';

const Login = () => {
  const [action, setAction] = useState("Login");
  const navigate = useNavigate();
  const clickAgain = () => { 
    navigate("https://www.google.com/")
};
  return (
    <div className={"container"}>
      <div className={"form-box"}>
          <div className={"header"}>
            <div className={"text"}>{action}</div>
            <div className={"underline"}></div>
          </div>

          <div className={"inputs"}>
            {action==="Login"?<div></div>: <div className={"input"}>
            <input type= "text" placeholder="Name"/>
            </div>}
          </div>

          <div className={"inputs"}>
            <div className={"input"}>
            <input type= "email" placeholder="Email"/>
            </div>
          </div>
          
          <div className={"inputs"}>
            <div className={"input"}>
            <input type= "password" placeholder="Password"/>
            </div>
          </div>

          {action==="Sign Up"?<div></div>: <div className="forget-password">Lost Password?  <a href="https://www.google.com/"> Click here!</a></div>}

          {action === "Login" ? (<div></div>) : ( <div className="forget-password">
            Have an account? <a onClick={() => setAction("Login")}> Click here!</a></div>)}

          <div className="submit-container">
            <div className={action=="Login"?"submit gray": "submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action=="Sign Up"?"submit gray": "submit"} onClick={()=>{setAction("Login")}}>Login</div>
          </div>
      </div>

    </div>
  )
}

export default Login
/*<div className={action=="Login"?"submit gray": "submit"} onClick={()=>{clickAgain}}>Login</div>*/