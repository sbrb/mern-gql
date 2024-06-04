import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../redux/userSlice';
import UserIcons from '../components/icons/UserIcons';


const Navbar = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = document.cookie.split(';').find(item => item.trim().startsWith('token='));
    useEffect(() => {
        if (!token) {
            navigate('/sign-in');
        } else {
            dispatch(fetchUserDetails());
        }
    }, [dispatch, navigate, token]);

    const handleClick = () => {
        navigate('/user-profile');
    }
    const homePage = () => {
        navigate('/');
    }

    const followCount = user?.following.length;
    
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <b><h3 onClick={homePage} >HOME</h3></b>
            </div>

            <div className="navbar-profile">
                {user?.profilePic ? (
                    <div>
                        <img src={user?.profilePic} className='user-profile-pic' alt='Profile Pic' onClick={handleClick} />
                    </div>
                ) : (
                    <div className='user-profile-icons nav-user-profile-icons' onClick={handleClick} >
                        <UserIcons />
                    </div>
                )}
                
                {followCount> 0 && (
                    <h2 className='follow-count'>{followCount}</h2>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
