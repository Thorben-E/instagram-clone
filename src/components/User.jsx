import React, { useContext, useEffect } from 'react';
import { ViewProfileContext } from '../contexts';

// eslint-disable-next-line react/prop-types
const User = ({user}) => {
  const {viewProfile, setViewProfile} = useContext(ViewProfileContext);
  useEffect(() => {
    setViewProfile(user); 
  });
  console.log(viewProfile);
  return (
    <div>
    </div>
  );
};

export default User;
