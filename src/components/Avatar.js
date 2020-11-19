import React from 'react';

let defaultChannelIcon =
  'https://mk0goaptixj55fpwbr6.kinstacdn.com/wp-content/plugins/buddyboss-platform/bp-core/images/mystery-group.png';

const Avatar = ({ user, showName, isUser, isDark }) => {
  return (
    user && (
      <div className='avatar-component'>
        <img
          className='avatar'
          src={isUser ? user.photoURL : user.avatar ? user.avatar : defaultChannelIcon}
          alt='Channel Icon'
        />
        {showName && <h3 className={`avatar-title ${isDark ? 'dark' : ''}`}>{user.displayName || user.name}</h3>}
      </div>
    )
  );
};

export default Avatar;
