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
import AddContact from './components/addContact';
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
  const [isAddContactModalOpen, setAddContactModalVisibility] = useState(false);

  useEffect(() => {
    //firebase.database().ref('users').child(user.uid).child('channels').child('-MLOZ3P2dQe8NEVv9-kS').remove();
    addListeners();
  }, []);

  const addListeners = () => {
    // channelsRef.on('child_added', (snap) => {
    //   let channel = snap.val();
    //   if (channel.users.includes(user.uid)) {
    //     channel['isPrivate'] = false;
    //     setFilterContacts((items) => [channel, ...items]);
    //   }
    // });
    // usersRef.on('child_added', (snap) => {
    //   if (snap.key !== user.uid) {
    //     let otherUser = snap.val();
    //     if (otherUser.contacted && otherUser.contacted.includes(user.uid)) {
    //       otherUser['isPrivate'] = true;
    //       otherUser['id'] = snap.key < user.uid ? `${user.uid}/${snap.key}` : `${snap.key}/${user.uid}`;
    //       setFilterContacts((items) => [otherUser, ...items]);
    //     }
    //   }
    // });

    usersRef
      .child(user.uid)
      .child('channels')
      .on('child_added', (s) => {
        const channelKey = s.val();
        channelsRef.child(channelKey).once('value', (snap) => {
          let channel = snap.val();
          channel['isPrivate'] = false;
          setFilterContacts((items) => [channel, ...items]);
        });
      });

    usersRef
      .child(user.uid)
      .child('contacted')
      .on('child_added', (s) => {
        const userKey = s.val();
        if (userKey !== user.uid) {
          usersRef.child(userKey).once('value', (snap) => {
            let otherUser = snap.val();
            otherUser['isPrivate'] = true;
            otherUser['id'] = snap.key < user.uid ? `${user.uid}/${snap.key}` : `${snap.key}/${user.uid}`;
            setFilterContacts((items) => [otherUser, ...items]);
          });
        }
      });
  };

  const updateChannels = async (snapChannel) => {
    try {
      snapChannel['isPrivate'] = false;
      setFilterContacts((items) => [snapChannel, ...items]);
      // let snap = await channelsRef.once('value');
      // let loadedChannels = [];
      // for (let [key, value] of Object.entries(snap.val())) {
      //   loadedChannels.push(value);
      // }
      // let hash = {};
      // let currentContacts = [...filteredContacts];
      // for (let i = 0; i < filteredContacts.length; i++) {
      //   hash[currentContacts[i].id] = true;
      // }
      // for (let i = 0; i < loadedChannels.length; i++) {
      //   if (hash[loadedChannels[i].id]) continue;
      //   else if (loadedChannels[i].users.includes(user.uid)) {
      //     currentContacts.unshift(loadedChannels[i]);
      //     hash[loadedChannels[i].id] = true;
      //   }
      // }
      // setFilterContacts(currentContacts);
    } catch (err) {
      console.log(err);
    }
  };

  const updateContacts = async (snapUser, contactID) => {
    try {
      // const snap = await usersRef.once('value');
      // let loadedContacts = [];
      // for (let [key, value] of Object.entries(snap.val())) {
      //   loadedContacts.push(value);
      // }
      // let currentContacts = [...filteredContacts];
      // currentContacts = currentContacts.filter((c) => c.indexOf('/') !== -1);
      snapUser['isPrivate'] = true;
      snapUser['id'] = contactID < user.uid ? `${user.uid}/${contactID}` : `${contactID}/${user.uid}`;
      setFilterContacts((items) => [snapUser, ...items]);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCreateChannelModalVisibility = () => setCreateChannelModalVisibility((v) => !v);
  const toggleJoinChannelModalVisibility = () => setJoinChannelModalVisibility((v) => !v);
  const toggleAddContactModalVisibility = () => setAddContactModalVisibility((v) => !v);

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
        <AddContact
          isOpen={isAddContactModalOpen}
          toggleVisibility={setAddContactModalVisibility}
          updateContacts={updateContacts}
        />
        {/*Modal */}
        <aside>
          <header>
            <Avatar user={user} showName isUser />
            <MDBDropdown>
              <MDBDropdownToggle style={{ padding: '5px 7px', margin: 0 }}>I</MDBDropdownToggle>
              <MDBDropdownMenu basic>
                <MDBDropdownItem>Profile</MDBDropdownItem>
                <MDBDropdownItem onClick={() => toggleAddContactModalVisibility()}>Add Contact</MDBDropdownItem>
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
            {/* Chat box */}
            <MessagesBox />
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
