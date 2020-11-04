import React, { useState } from 'react';

const SenfFileModal = ({ file, setFile, uploadFile }) => {
  return (
    <div className='modal fade' id='sendFileModal' tabIndex='-1' aria-labelledby='sendFileModal' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='sendFileTitle'>
              Choose File
            </h5>
            <button type='button' className='btn-close' data-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <div className='input-group mb-3'>
              <span className='input-group-text' id='inputGroupFileAddon01'>
                Upload
              </span>
              <div className='form-file'>
                <input
                  type='file'
                  className='form-file-input'
                  id='sendFileInput'
                  aria-describedby='inputGroupFileAddon01'
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label className='form-file-label' htmlFor='sendFileInput'>
                  <span className='form-file-text'>{file ? file.name : 'Choose File...'}</span>
                  <span className='form-file-button'>Browse</span>
                </label>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-dismiss='modal'>
              Close
            </button>
            <button type='button' className='btn btn-primary' onClick={(e) => uploadFile(e)}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenfFileModal;
