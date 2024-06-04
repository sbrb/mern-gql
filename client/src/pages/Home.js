import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ReactPaginate from 'react-paginate';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserIcons from '../components/icons/UserIcons';
import Navbar from '../components/Navbar';
import { FETCH_ALL_USERS } from '../graphql/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../graphql/mutations';

const Home = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 12;
  const pagesVisited = pageNumber * usersPerPage;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = document.cookie.split(';').find(item => item.trim().startsWith('token='));

  useEffect(() => {
    if (!token) {
        navigate('/sign-in');

    }
  }, [token, navigate]);


  const { loading, data, refetch } = useQuery(FETCH_ALL_USERS, {
    skip: !token,
  });
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleFollow = async (treatedUserId) => {
    try {
      const response = await followUser({ variables: { treatedUserId } });
      if (response.data) {
        refetch();
        dispatch(fetchUserDetails());
        toast.success('Successfully followed');
      }
    } catch (error) {
      toast.error('Error following user');
    }
  };

  const handleUnfollow = async (treatedUserId) => {
    try {
      const response = await unfollowUser({ variables: { treatedUserId } });
      if (response.data) {
        refetch();
        dispatch(fetchUserDetails());
        toast.success('Successfully unfollowed');
      }
    } catch (error) {
      toast.error('Error unfollowing user');
    }
  };

  const pageCount = data ? Math.ceil(data?.allUsers?.length / usersPerPage) : 0;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <Navbar />
      <div className="user-card-container">
        {loading ? (
          Array.from({ length: usersPerPage }).map((_, index) => (
            <div key={index} className="user-card">
              <Skeleton height={220} width={220} />
              <div className="user-details">
                <div className='user-profile-icons'>
                  <UserIcons />
                </div>
                <p className='sc-user-dit'></p>
                <p className='sc-user-dit'></p>
                <button className="unfollow-button sc-lood-btn" ></button>
              </div>
            </div>
          ))
        ) : (
          data?.allUsers.slice(pagesVisited, pagesVisited + usersPerPage).map((user, index) => (
            <div key={index} className="user-card">
              {user.profilePic ? (
                <div>
                  <img src={user?.profilePic} className='user-image' alt='Profile Pic' />
                </div>
              ) : (
                <div className='user-profile-icons'>
                  <UserIcons />
                </div>
              )}
              <div className="user-details">
                <p><b> {user?.firstName} {user?.lastName}</b></p>
                <i> {user?.userName}</i>
                <br />
                <br />
                {user?.follow ? (
                  <button className="unfollow-button" onClick={() => handleUnfollow(user?._id)}>Unfollow</button>
                ) : (
                  <button className="follow-button" onClick={() => handleFollow(user?._id)}>Follow</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
      <ToastContainer position="top-left" />
    </>
  );
}

export default Home;
