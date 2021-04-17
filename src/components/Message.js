import { MDBIcon } from 'mdbreact';
import React, { useState, useEffect } from 'react';
import doubleCheck from '../assets/done_all.svg';

let extensions = ['jpg', 'jpeg', 'png', 'mp4', 'mp3', 'mpeg', 'ogg'];

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

  const getTime = (t) => {
    let a = new Date(t);
    let str = '';
    let h = a.getHours(),
      m = a.getMinutes();
    let s = '';
    if (h == 12) {
      s = 'PM';
    } else if (h < 12) {
      s = 'AM';
    } else if (h > 12) {
      s = 'PM';
      h -= 12;
    }
    return str.concat(h, ':', m, ' ', s);
  };

  const Metadata = (
    <div className='metadata'>
      <span className={`date${isOwner ? '-dark' : ''}`}>{getTime(message.timestamp).toString()}</span>
      {/* {isOwner && <img src={doubleCheck} alt='' className='icon-small' />} */}
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
      ) : extension === 'mp3' || extension === 'mpeg' || extension === 'ogg' ? (
        <audio controls>
          <source src={message.fileURL} type={`audio/${extension}`} />
          Your browser does not support the audio tag.
        </audio>
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
