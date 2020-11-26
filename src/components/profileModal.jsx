import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

const ProfileModal = ({ isOpen, toggleVisibility }) => {
  return (
    <MDBModal isOpen={isOpen} toggle={() => toggleVisibility()} fullHeight position='right' id='profile-modal'>
      <MDBModalHeader toggle={() => toggleVisibility()}>MDBModal title</MDBModalHeader>
      <MDBModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={() => toggleVisibility()}>
          Close
        </MDBBtn>
        <MDBBtn color='primary'>Save changes</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default ProfileModal;
