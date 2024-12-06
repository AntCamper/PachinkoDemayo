import React from 'react';

function Launcher({ onLaunch }) {
  return (
    <button className="launcher" onClick={onLaunch}>
      Launch Ball
    </button>
  );
}

export default Launcher;