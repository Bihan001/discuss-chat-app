import React from 'react';
import { MDBProgress } from 'mdbreact';

const ProgressBar = ({ uploadState, uploadPercent }) => {
  return (
    uploadState === 'uploading' && (
      <MDBProgress material className='my-2' value={uploadPercent} height='15px' animated color='success'>
        {uploadPercent}%
      </MDBProgress>
    )
  );
};

export default ProgressBar;
