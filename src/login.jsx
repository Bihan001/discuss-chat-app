import React from 'react';
import { MDBIcon } from 'mdbreact';
import ChatIcon from './assets/chat.svg';

const Login = (props) => {
  return (
    <div className='login-main'>
      <div>
        <h3 className='pb-3 text-center'>
          Welcome to Discuss <img src={ChatIcon} style={{ width: 70, paddingLeft: 5 }} />
        </h3>
        <button className='google-signin-btn' onClick={() => props.signin()}>
          <MDBIcon fab icon='google-plus-g' style={{ fontSize: '1.2rem' }} />
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;
