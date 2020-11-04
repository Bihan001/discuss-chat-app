import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Avatar from './components/Avatar';
import ContactBox from './components/ContactBox';
import MessagesBox from './components/MessagesBox';
import ChatInputBox from './components/ChatInputBox';
import Search from './components/Search';
import Welcome from './components/Welcome';
import CreateChannel from './components/createChannel';
import firebase from './firebase';

import './App.css';

const Main = ({ user: { user, currentContact }, signout }) => {
  //const [message, setMessage] = useState('');
  //const [search, setSearch] = useState('');
  const [filteredContacts, setFilterContacts] = useState([]);
  const [channelsRef] = useState(firebase.database().ref('channels'));

  useEffect(() => {
    addListeners();
  }, []);

  const addListeners = () => {
    channelsRef.on('child_added', (snap) => {
      setFilterContacts((items) => [snap.val(), ...items]);
    });
  };

  return (
    user && (
      <div className='app'>
        <CreateChannel user={user} /> {/*Modal */}
        <aside>
          <header>
            <Avatar user={user} showName />
            <div className='dropdown'>
              <a className='dropdown-toggle' id='dropdownMenuButton' data-toggle='dropdown' aria-expanded='false'>
                I
              </a>
              <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                <li>
                  <span className='dropdown-item'>Add friend</span>
                </li>
                <li>
                  <span className='dropdown-item' data-toggle='modal' data-target='#CreateChannelModal'>
                    Create Channel
                  </span>
                </li>
                <li>
                  <span className='dropdown-item'>Join Channel</span>
                </li>
                <li>
                  <span className='dropdown-item' onClick={(e) => signout(e)}>
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          </header>
          <Search />
          <div className='contact-boxes'>
            {filteredContacts.length > 0 &&
              filteredContacts.map((item) => <ContactBox contact={item} key={item.id} messages={[]} />)}
          </div>
        </aside>
        {currentContact ? (
          <main>
            <header>
              <Avatar user={currentContact} showName /> {/* Contact header on selected chat */}
            </header>
            <MessagesBox messages={[]} /> {/* Chat box */}
            <ChatInputBox />
          </main>
        ) : (
          <Welcome />
        )}
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Main);
