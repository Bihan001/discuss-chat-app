import React from 'react';
import doubleCheck from '../assets/done_all.svg';

export default function Message({ message, isOwner }) {
  return (
    <div className={`message ${isOwner ? 'sent' : 'received'}`}>
      {message.message}
      <div className='metadata'>
        <span className='date'>{message.timestamp.toLocaleString()}</span>
        {isOwner && <img src={doubleCheck} alt='' className='icon-small' />}
      </div>
    </div>
  );
}
