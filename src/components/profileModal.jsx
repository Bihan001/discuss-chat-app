import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux';

const ProfileModal = ({ isOpen, toggleVisibility, user: { user } }) => {
  return (
    user && (
      <MDBModal isOpen={isOpen} toggle={() => toggleVisibility()} fullHeight position='right' id='profile-modal'>
        <MDBModalHeader toggle={() => toggleVisibility()}>PROFILE</MDBModalHeader>
        <MDBModalBody>
          <div className='profile-main'>
            <img className='profile-img' src={user.photoURL} />
            <div className='profile-details'>
              <p>ID: {user.uid}</p>
              <p>Name: {user.displayName}</p>
              <p>Email: {user.email}</p>
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
