import React,  {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle, signUpWithEmail } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../style/Login.css'


function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [user, loading, error] = useAuthState(auth); 
    const navigate = useNavigate(); 
    
    useEffect(() => {
        if(loading) return; 
        if(user) navigate("/homepage"); 
    }, [user, loading])

return (
    <div className="login" data-testid="login-container">
        <div className="login-container">
            <input 
            type="text"
            className="login-txt-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            data-testid="login-email-input"
            />
            <input
            type="password"
            className="login-txt-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            data-testid="login-password-input"
            />
            <button
            className="login-btn-email"
            onClick={() => signUpWithEmail(email, password)}
            data-testid="login-submit-button"
            >
                Login
            </button>
            <button className="login-btn-google" onClick={signInWithGoogle} data-testid="login-google-button">
                Login with Google
            </button>
            <button 
            className="guest-login-btn"
            onClick={() => signUpWithEmail("guest-user@quack.com", "123321")}
            data-testid="login-guest-button">
                Login as Guest
            </button>
            <div>
                <Link to="/reset" data-testid="login-forgot-password-link">Forgot Password</Link>
            </div>
            <div>
                Don't have and account? <Link to="/register" data-testid="login-register-link">Register</Link> now.
            </div>
        </div>
    </div>
  )
}

export default Login