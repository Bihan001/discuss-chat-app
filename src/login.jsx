import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

const Login = (props) => {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <h3 className='pb-3'>Welcone to Discuss</h3>
      <GoogleLoginButton onClick={() => props.signin()} />
    </div>
  );
};

export default Login;
