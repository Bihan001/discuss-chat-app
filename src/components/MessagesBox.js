import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import firebase from '../firebase';
import ScrollToBottom from 'react-scroll-to-bottom';

let prevContact = null;

const MessagesBox = ({ user: { user, currentContact }, userNames }) => {
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);
  const [usersRef] = useState(firebase.database().ref('users'));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useEffect(scrollToBottom, [messages]);

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

  return (
    messagesRef && (
      <div className='chats'>
        {messages.map((m) => (
          <Message key={m.id} message={m} isOwner={m.user === user.uid} isPrivate={currentContact.isPrivate} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MessagesBox);
