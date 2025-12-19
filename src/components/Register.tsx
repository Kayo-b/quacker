import React, {useState, useEffect} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth, registerEmail, signInWithGoogle } from '../firebase'; 
import "../style/Register.css"

function Register() {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [user, loading, error] = useAuthState(auth);
    const history = useNavigate();

    const register = () => {
        if(!name) alert("Please enter name");
        registerEmail(name, email, password);
    }

    useEffect(() => {
        if(loading) return;
        if(user) return history("/dashboard");
    },[user, loading])    

  return (
    <div className="register" data-testid="register-container">
        <div className="register-container">
            <input 
            type="text" 
            placeholder="Full Name" 
            className="register-txt-input"
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="register-name-input"
            />
            <input
            type="email"
            placeholder="Email"
            className="register-txt-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="register-email-input"
            />
            <input
            type="password"
            placeholder="Password"
            className="register-txt-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="register-password-input"
            />
            <button 
            className="register-btn" 
            onClick={register}
            data-testid="register-submit-button">
            Register
            </button>
            <button
            className="register-google-btn"
            onClick={signInWithGoogle}
            data-testid="register-google-button"
            >
            Register with Google
            </button>
            <div>
                Alredy have an account? <Link to="/" data-testid="register-login-link">Login</Link>
            </div>

        </div>
    </div>
  )
}

export default Register