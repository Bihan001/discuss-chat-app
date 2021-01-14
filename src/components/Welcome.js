import React from 'react';
import introImg from '../assets/intro-whatsapp.jpg';

export default function Welcome({ hasContacts }) {
  return (
    <div className='welcome'>
      {/* <img src={introImg} alt='' /> */}
      <h2>Welcome to Discuss</h2>
      <h5 style={{ fontWeight: 400 }}>Add contacts or join channels to get started!</h5>
      {!hasContacts && (
        <h5 style={{ color: '#f5f5f5', fontWeight: 400, fontSize: '1.1rem', textAlign: 'center' }}>
          First time here? Go to Add Contact and use this id: "<b>LBrK1mGGZ8SjE2xBexYl2jxdjnH3</b>" to start chatting
          with the admin.
        </h5>
      )}
    </div>
  );
}
