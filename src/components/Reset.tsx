import React, { useState, useEffect }  from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordReset, auth } from '../firebase'
import '../style/Reset.css'

function Reset() {
  const [email, setEmail] = useState<string>();
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate();

  useEffect(() => {//check if user is already logged
    if(loading) return;
    if(user) navigate("/dashboard");
  }, [user, loading])
  
  return (
    <div className="reset">
      <div className="reset-container">
        <input
        className="reset-txt-input"
        type="email"
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <button
        className="reset-btn"
        onClick={() => sendPasswordReset(email!)}
        >
        </button>
      </div>
    </div>
  )
}

export default Reset