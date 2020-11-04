import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import firebase from '../firebase';

const MessagesBox = ({ user: { user, currentContact } }) => {
  const [messages, setMessages] = useState([]);
  const [messagesRef] = useState(firebase.database().ref('messages'));
  useEffect(() => {
    setMessages([]);
    messagesRef.child(currentContact.id).on('child_added', (snap) => {
      setMessages((items) => [...items, snap.val()]);
    });
  }, [currentContact.id]);
  const endDiv = useRef(null);
  // useEffect(() => {
  //   endDiv.current.scrollIntoView();
  // }, [messages]);

  return (
    <div className='chats'>
      {messages.map((m, i) => (
        <Message key={i} message={m} isOwner={m.user === user.uid} />
      ))}
      <div style={{ float: 'right', clear: 'both' }} ref={endDiv}></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MessagesBox);
