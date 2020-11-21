import { MDBIcon } from 'mdbreact';
import React, { useState, useEffect } from 'react';
import doubleCheck from '../assets/done_all.svg';

let extensions = ['jpg', 'jpeg', 'png', 'mp4'];

export default function Message({ message, isOwner, isPrivate }) {
  const [extension, setExtension] = useState('');

  useEffect(() => {
    if (message && message.fileURL) {
      let end = message.fileURL.split('.').pop();
      let chk = false;
      extensions.forEach((e) => {
        if (end.includes(e)) {
          chk = true;
          setExtension(e);
        }
      });
      if (!chk) setExtension('other');
    }
  }, []);

  const Metadata = (
    <div className='metadata'>
      <span className={`date${isOwner ? '-dark' : ''}`}>{new Date(message.timestamp).toLocaleTimeString('en-US')}</span>
      {isOwner && <img src={doubleCheck} alt='' className='icon-small' />}
    </div>
  );

  return (
    <div className={`message ${isOwner ? 'sent' : 'received'}`}>
      {!isPrivate && !isOwner && message.user_name && (
        <div className='user_name'>{message.user_name.split(' ')[0]}</div>
      )}
      {extension === 'jpg' || extension === 'jpeg' || extension === 'png' ? (
        <img className='img-fluid' src={message.fileURL} />
      ) : extension === 'mp4' || extension === 'mkv' ? (
        <video className='msg-video' controls>
          <source src={message.fileURL} type={`video/${extension}`} />
        </video>
      ) : extension.trim() !== '' ? (
        <a href={message.fileURL} download target='_blank'>
          <i data-test='fa' className='fas fa-long-arrow-alt-down pr-1'></i> Download File
        </a>
      ) : null}
      {message.message}
      {Metadata}
    </div>
  );
}
