import React from 'react';
import { MDBIcon } from 'mdbreact';

const Login = (props) => {
  return (
    <div className='login-main'>
      <div>
        <h3 className='pb-3'>Welcome to Discuss</h3>
        <button className='google-signin-btn' onClick={() => props.signin()}>
          <MDBIcon fab icon='google-plus-g' style={{ fontSize: '1.2rem' }} />
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;
