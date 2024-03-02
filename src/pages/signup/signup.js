// Import necessary dependencies
import React, { useState } from 'react';
import './signup.css'; // Ensure you have a corresponding CSS file
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig'; // Adjust this path as needed
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle signup
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      navigate('/'); // Navigate to home or dashboard as needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={"container"}>
      <div className={"form-box"}>
        <div className={"header"}>
          <div className={"text"}>Sign Up</div>
          <div className={"underline"}></div>
        </div>
        <form onSubmit={handleSignup}>
          <div className={"inputs"}>
            <div className={"input"}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={"input"}>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="submit-container">
            <div className="submit">Sign Up</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
