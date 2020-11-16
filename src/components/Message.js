import React, { useState, useEffect } from 'react';
import doubleCheck from '../assets/done_all.svg';

let extensions = ['jpg', 'jpeg', 'png', 'mp4'];

export default function Message({ message, isOwner, isPrivate }) {
  const [extension, setExtension] = useState('');

  useEffect(() => {
    if (message && message.fileURL) {
      let end = message.fileURL.split('.').pop();
      extensions.forEach((e) => {
        if (end.includes(e)) {
          setExtension(e);
        }
      });
    }
  }, []);

  return (
    <div className={`message ${isOwner ? 'sent' : 'received'}`}>
      {!isPrivate && !isOwner && message.user_name && (
        <div className='user_name'>{message.user_name.split(' ')[0]}</div>
      )}
      {extension === 'jpg' || extension === 'jpeg' || extension === 'png' ? (
        <div>
          <img className='img-fluid' src={message.fileURL} />
        </div>
      ) : extension === 'mp4' || extension === 'mkv' ? (
        <div>
          <video width='320' height='240' controls>
            <source src={message.fileURL} type={`video/${extension}`} />
          </video>
        </div>
      ) : null}
      {message.message}
      <div className='metadata'>
        <span className='date'>{new Date(message.timestamp).toLocaleTimeString('en-US')}</span>
        {isOwner && <img src={doubleCheck} alt='' className='icon-small' />}
      </div>
    </div>
  );
}
