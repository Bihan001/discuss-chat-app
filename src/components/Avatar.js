import React from 'react';

const Avatar = ({ user, showName }) => {
  return (
    <div className='avatar-component'>
      <img className='avatar' src={user.photoURL} alt='' />
      {showName && <h3 className='avatar-title'>{user.displayName || user.name}</h3>}
    </div>
  );
};

export default Avatar;
