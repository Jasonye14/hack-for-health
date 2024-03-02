import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig'; // Correct this path according to your project structure
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle traditional email/password sign-in
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      navigate('/'); // Adjust this as needed
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle Google Sign-In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Adjust this as needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={"container"}>
      <div className={"form-box"}>
        <div className={"header"}>
          <div className={"text"}>{action}</div>
          <div className={"underline"}></div>
        </div>
        {action === "Login" && (
          <form onSubmit={handleLogin}>
            <div className={"inputs"}>
              <div className={"input"}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            
            <div className={"inputs"}>
              <div className={"input"}>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="submit" onClick={handleLogin}>Login</div>
          </form>
        )}
        <div className="submit" onClick={signInWithGoogle}>Sign in with Google</div>
        <div className="switch-action">
          {action === "Login" ? (
            <div onClick={() => setAction("Sign Up")}>Don't have an account? Sign Up</div>
          ) : (
            <div onClick={() => setAction("Login")}>Already have an account? Login</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
