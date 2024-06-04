import React, { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import UserIcons from '../components/icons/UserIcons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { clearCookies } from '../utils/clearCookies';



const UserProfile = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const user = useSelector((state) => state.user.user);

  const token = document.cookie.split(';').find(item => item.trim().startsWith('token='));

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
  }, [navigate,token]);

  const handleLogOut = () => {
    clearCookies();
    client.clearStore();
    navigate('/sign-in')
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className='h-screen-center'>
        <div className='user-profile'>
          <span className='pro-close' onClick={handleClose}>X</span>
          {user?.profilePic ? (
            <div>
              <img src={user?.profilePic} className='user-profile-pic' alt='Profile Pic' />
            </div>
          ) : (
            <div className='user-profile-icons'>
              <UserIcons />
            </div>
          )}
          <div>
            <div className='user-full-details'>
              <div className='user-details'>
                <h3>{user?.firstName} {user?.lastName}</h3>
                <p>{user?.userName}</p>
              </div>
              <button className='logout-button' onClick={handleLogOut}>Log out</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
