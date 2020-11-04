import React, { useState } from 'react';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <input type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={(e) => props.register(email, password)}>Register</button>
      <button onClick={(e) => props.signin(email, password)}>Sign in</button>
      <button onClick={(e) => props.signout(e)}>Sign out</button>
    </div>
  );
};

export default Login;
