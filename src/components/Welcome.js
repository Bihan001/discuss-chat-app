import React from 'react';
import ChatIcon from '../assets/chat.svg';
export default function Welcome({ hasContacts }) {
  return (
    <div className='welcome'>
      {/* <img src={introImg} alt='' /> */}
      <h2>
        Welcome to Discuss
        <img src={ChatIcon} style={{ width: 50, paddingLeft: 10 }} />
      </h2>
      <h5 style={{ fontWeight: 400 }}>Add contacts or join channels to get started!</h5>
      {!hasContacts && (
        <h5 style={{ color: '#f5f5f5', fontWeight: 400, fontSize: '1.1rem', textAlign: 'center' }}>
          First time here? Go to Add Contact and use this id: "<b>muKJ1R6W2Kckf7g6bCQrN3LmB2j2</b>" to start chatting
          with the admin.
        </h5>
      )}
    </div>
  );
}
