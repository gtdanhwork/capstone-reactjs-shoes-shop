import React from 'react';
import { Outlet } from 'react-router-dom';

const UserTemplate = () => {
  return (
    <div className="user-template min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default UserTemplate;