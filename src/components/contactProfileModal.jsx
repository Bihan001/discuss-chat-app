import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux';

const ProfileModal = ({ isOpen, toggleVisibility, user: { currentContact, user } }) => {
  const getID = (c) => {
    if (!c.isPrivate) return c.id;
    let arr = c.id.split('/');
    return arr[0] === user.uid ? arr[1] : arr[0];
  };
  return (
    currentContact && (
      <MDBModal
        isOpen={isOpen}
        toggle={() => toggleVisibility()}
        fullHeight
        position='right'
        id='contact-profile-modal'>
        <MDBModalHeader toggle={() => toggleVisibility()}>
          {currentContact.isPrivate ? 'Contact' : 'Channel'} Details
        </MDBModalHeader>
        <MDBModalBody>
          <div className='profile-main'>
            <img className='profile-img' src={currentContact.avatar} />
            <div className='profile-details'>
              <p>ID: {getID(currentContact)}</p>
              <p>Name: {currentContact.name}</p>
              {!currentContact.isPrivate && <p>Description: {currentContact.description}</p>}
              {!currentContact.isPrivate && <p>Date created: {new Date(currentContact.dateCreated).toDateString()}</p>}
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={() => toggleVisibility()}>
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(ProfileModal);
