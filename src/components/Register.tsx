import React, {useState, useEffect} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth, registerEmail, signInWithGoogle } from '../firebase'; 
import "..Register.css"

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
        if(user) return history("/homepage");
    },[user, loading])    

  return (
    <div className="register">
        <div className="register-container">
            <input 
            type="text" 
            placeholder="Full Name" 
            className="register-txt-input"
            value={name}
            onChange={e => setName(e.target.value)}
            />
            <input
            type="email"
            placeholder="Email"
            className="register-txt-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            className="register-txt-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button 
            className="register-btn" 
            onClick={register}>
            Register
            </button>
            <button
            className="register-google-btn"
            onClick={signInWithGoogle}
            >
            Register with Google
            </button>
            <div>
                Alredy have an account? <Link to="/">Login</Link>
            </div>

        </div>
    </div>
  )
}

export default Register