import React from 'react';
import introImg from '../assets/intro-whatsapp.jpg';

export default function Welcome() {
  return (
    <div className='welcome'>
      {/* <img src={introImg} alt='' /> */}
      <h2>Welcome to Discuss</h2>
      <h5>Add contacts or join channels to get started!</h5>
    </div>
  );
}
