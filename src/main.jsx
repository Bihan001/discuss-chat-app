import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Avatar from './components/Avatar';
import ContactBox from './components/ContactBox';
import MessagesBox from './components/MessagesBox';
import ChatInputBox from './components/ChatInputBox';
import Search from './components/Search';
import Welcome from './components/Welcome';
import CreateChannel from './components/createChannel';
import JoinChannel from './components/joinChannel';
import firebase from './firebase';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import './App.css';

const Main = ({ user: { user, currentContact }, signout }) => {
  //const [message, setMessage] = useState('');
  //const [search, setSearch] = useState('');
  const [filteredContacts, setFilterContacts] = useState([]);
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const [usersRef] = useState(firebase.database().ref('users'));
  const [isCreateChannelModalOpen, setCreateChannelModalVisibility] = useState(false);
  const [isJoinChannelModalOpen, setJoinChannelModalVisibility] = useState(false);

  useEffect(() => {
    //firebase.database().ref('users').child(user.uid).child('channels').child('-MLOZ3P2dQe8NEVv9-kS').remove();
    addListeners();
  }, []);

  const addListeners = () => {
    channelsRef.on('child_added', (snap) => {
      let channel = snap.val();
      if (channel.users.includes(user.uid)) {
        setFilterContacts((items) => [channel, ...items]);
      }
    });
  };

  const updateChannels = async () => {
    try {
      const snap = await channelsRef.once('value');
      let loadedChannels = [];
      for (let [key, value] of Object.entries(snap.val())) {
        loadedChannels.push(value);
      }
      setFilterContacts(loadedChannels);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCreateChannelModalVisibility = () => setCreateChannelModalVisibility((v) => !v);
  const toggleJoinChannelModalVisibility = () => setJoinChannelModalVisibility((v) => !v);

  return (
    user && (
      <div className='app'>
        <CreateChannel
          user={user}
          isOpen={isCreateChannelModalOpen}
          toggleVisibility={toggleCreateChannelModalVisibility}
        />
        <JoinChannel
          isOpen={isJoinChannelModalOpen}
          toggleVisibility={toggleJoinChannelModalVisibility}
          updateChannels={updateChannels}
        />
        {/*Modal */}
        <aside>
          <header>
            <Avatar user={user} showName />
            <MDBDropdown>
              <MDBDropdownToggle style={{ padding: '5px 7px', margin: 0 }}>I</MDBDropdownToggle>
              <MDBDropdownMenu basic>
                <MDBDropdownItem>Profile</MDBDropdownItem>
                <MDBDropdownItem>Add Friend</MDBDropdownItem>
                <MDBDropdownItem onClick={() => toggleJoinChannelModalVisibility()}>Join Channel</MDBDropdownItem>
                <MDBDropdownItem onClick={() => toggleCreateChannelModalVisibility()}>Create Channel</MDBDropdownItem>
                <MDBDropdownItem divider />
                <MDBDropdownItem onClick={(e) => signout(e)}>Logout</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
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
