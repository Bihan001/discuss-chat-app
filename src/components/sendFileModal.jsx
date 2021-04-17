import React, { useState } from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

const SenfFileModal = ({ file, setFile, uploadFile, isOpen, toggleModal }) => {
  return (
    <MDBModal isOpen={isOpen} toggle={toggleModal} centered>
      <MDBModalHeader toggle={toggleModal}>Choose File</MDBModalHeader>
      <MDBModalBody>
        <div className='input-group'>
          <div className='input-group-prepend'>
            <span className='input-group-text' id='inputGroupFileAddon01'>
              Upload
            </span>
          </div>
          <div className='custom-file'>
            <input
              type='file'
              className='custom-file-input'
              id='uploadModal'
              aria-describedby='inputGroupFileAddon01'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label className='custom-file-label' htmlFor='uploadModal'>
              {file ? file.name : 'Choose file...'}
            </label>
          </div>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleModal}>
          Close
        </MDBBtn>
        <MDBBtn color='primary' onClick={(e) => uploadFile(e)}>
          Send
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default SenfFileModal;
