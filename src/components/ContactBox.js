import React from 'react';
import { connect } from 'react-redux';
import doubleCheck from '../assets/done_all.svg';
import Avatar from './Avatar';
import { setCurrentChannel, setCurrentChatUser } from '../actions/user';

const ContactBox = ({
  contact,
  setCurrentChannel,
  setCurrentChatUser,
  getNotificationCount,
  user: { user, currentContact },
  toggleMobileMessageModalVisibility,
}) => {
  //const maxTs = Math.max(...messages.map((m) => m.date.getTime()));
  //const lastMsg = messages.find((m) => m.date.getTime() === maxTs);

  // function truncate(text, length) {
  //   return text.length > length ? `${text.substring(0, length)} ...` : text;
  // }

  const getNotifications = (a) => {
    if (!currentContact || (currentContact && contact.id !== currentContact.id)) {
      const cnt = getNotificationCount(a);
      if (cnt > 0) return <span className='time-mark'>{cnt}</span>;
    }
    return null;
  };

  const channelView = (
    <div
      className={`contact-box ${currentContact && currentContact.id === contact.id ? 'active' : ''}`}
      onClick={() => {
        setCurrentChannel(contact);
        toggleMobileMessageModalVisibility();
      }}>
      <Avatar user={contact} />
      <div className='right-section'>
        <div style={{ width: '100%' }}>
          <div className='contact-box-header'>
            <h3 className='contact-title'>{contact.name}</h3>
            {getNotifications(contact.id)}
          </div>
          <div className='last-msg'>
            {/* <img src={doubleCheck} alt='' className='icon-small' /> */}
            {/* <span className='text'>{truncate(lastMsg.msg, 30)}</span> */}
          </div>
        </div>
      </div>
    </div>
  );

  const userView = (
    <div
      className={`contact-box ${currentContact && currentContact.id === contact.id ? 'active' : ''}`}
      onClick={() => {
        setCurrentChannel(contact, user.uid);
        toggleMobileMessageModalVisibility();
      }}>
      <Avatar user={contact} />
      <div className='right-section'>
        <div style={{ width: '100%' }}>
          <div className='contact-box-header'>
            <h3 className='contact-title'>{contact.name}</h3>
            {getNotifications(contact.id)}
          </div>
          <div className='last-msg'>
            {/* <img src={doubleCheck} alt='' className='icon-small' /> */}
            {/* <span className='text'>{truncate(lastMsg.msg, 30)}</span> */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // <div className='contact-box' onClick={() => setContactSelected(contact)}>
    contact.isPrivate ? userView : channelView
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { setCurrentChannel, setCurrentChatUser })(ContactBox);
