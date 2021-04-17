import React, { useEffect } from 'react';
import MessagesBox from './MessagesBox';
import Avatar from './Avatar';
import ChatInputBox from './ChatInputBox';
import { connect } from 'react-redux';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon } from 'mdbreact';
import ContactProfileModal from './contactProfileModal';

const MobileMessageModal = ({
  isVisible,
  toggleVisibility,
  isContactProfileModalVisible,
  toggleContactProfileModalVisibility,
  userNames,
  user: { currentContact },
}) => {
  // useEffect(() => {
  //   let modalRef = document.querySelector('.message-modal');
  //   if (modalRef) {
  //     if (!isVisible) {
  //       modalRef.style.opacity = 0;
  //     } else {
  //       modalRef.style.opacity = 1;
  //     }
  //   }
  // }, [isVisible]);
  return (
    currentContact && (
      <MDBModal
        isOpen={isVisible}
        toggle={() => toggleVisibility()}
        fullHeight
        position='right'
        id='message-modal'
        backdropClassName='backdrop'>
        <ContactProfileModal
          isOpen={isContactProfileModalVisible}
          toggleVisibility={toggleContactProfileModalVisibility}
        />
        <main className='message-modal'>
          {/* <button onClick={() => toggleVisibility()}>close</button> */}
          <header onClick={() => toggleContactProfileModalVisibility()}>
            <Avatar user={currentContact} showName /> {/* Contact header on selected chat */}
            {currentContact.isPrivate ? (
              currentContact.status === 'online' ? (
                <MDBIcon icon='circle' style={{ color: '#7CFC00', paddingLeft: '5px', fontSize: '0.8rem' }} />
              ) : (
                <MDBIcon icon='circle' style={{ color: '#FF4500', paddingLeft: '5px', fontSize: '0.8rem' }} />
              )
            ) : null}
          </header>
          <MessagesBox userNames={userNames} />
          <ChatInputBox />
        </main>
      </MDBModal>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MobileMessageModal);
