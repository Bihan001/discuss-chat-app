import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import firebase from '../firebase';

let prevContact = null;

const MessagesBox = ({ user: { user, currentContact }, userNames }) => {
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);
  const [usersRef] = useState(firebase.database().ref('users'));

  useEffect(() => {
    if (messagesRef) messagesRef.child(prevContact ? prevContact : currentContact.id).off('child_added');
    if (currentContact.isPrivate) {
      setMessagesRef(firebase.database().ref('private_messages'));
    } else {
      setMessagesRef(firebase.database().ref('messages'));
    }
  }, [currentContact]);

  useEffect(() => {
    setMessages([]);
    if (messagesRef) {
      console.log(currentContact.id);
      prevContact = currentContact.id;
      messagesRef.child(currentContact.id).on('child_added', (snap) => {
        let msg = snap.val();
        msg['id'] = snap.key;
        msg['user_name'] = userNames[msg.user];
        setMessages((items) => [...items, msg]);
      });
    }
  }, [messagesRef]);

  const endDiv = useRef(null);
  // useEffect(() => {
  //   endDiv.current.scrollIntoView();
  // }, [messages]);

  return (
    messagesRef && (
      <div className='chats'>
        {messages.map((m) => (
          <Message key={m.id} message={m} isOwner={m.user === user.uid} isPrivate={currentContact.isPrivate} />
        ))}
        <div style={{ float: 'right', clear: 'both' }} ref={endDiv}></div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MessagesBox);
