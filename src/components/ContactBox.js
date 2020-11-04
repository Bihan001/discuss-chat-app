import React from 'react';
import { connect } from 'react-redux';
import doubleCheck from '../assets/done_all.svg';
import Avatar from './Avatar';
import { setCurrentContact } from '../actions/user';

const ContactBox = ({ contact, setCurrentContact, messages, user: { user, currentContact } }) => {
  //const maxTs = Math.max(...messages.map((m) => m.date.getTime()));
  //const lastMsg = messages.find((m) => m.date.getTime() === maxTs);

  // function truncate(text, length) {
  //   return text.length > length ? `${text.substring(0, length)} ...` : text;
  // }

  return (
    // <div className='contact-box' onClick={() => setContactSelected(contact)}>
    <div
      className={`contact-box ${currentContact && currentContact.id == contact.id ? 'active' : ''}`}
      onClick={() => setCurrentContact(contact.id)}>
      <Avatar user={user} />
      <div className='right-section'>
        <div className='contact-box-header'>
          <h3 className='avatar-title'>{contact.name}</h3>
          <span className='time-mark'>29/10/2020</span>
        </div>
        <div className='last-msg'>
          <img src={doubleCheck} alt='' className='icon-small' />
          {/* <span className='text'>{truncate(lastMsg.msg, 30)}</span> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { setCurrentContact })(ContactBox);
