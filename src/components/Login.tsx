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

    // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault(); 
    //     await auth.signInWithEmailAndPassword(email, password); 
    // }

return (
    <div className="login">
        <div className="login-container">
            <input 
            type="text"
            className="login-txt-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            />
            <input
            type="password"
            className="login-txt-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            />
            <button
            className="login-btn-email"
            onClick={() => signUpWithEmail(email, password)}
            >
                Login
            </button>
            <button className="login-btn-google" onClick={signInWithGoogle}>
                Login with Google
            </button>
            <div>
                <Link to="/reset">Forgot Password</Link>
            </div>
            <div>
                Don't have and account? <Link to="/register"></Link> now.
            </div>
        </div>
    </div>
  )
}

export default Login