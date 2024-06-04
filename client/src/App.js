import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import UserProfile from './pages/UserProfile';
import SignUp from './pages/Siginup';
import SignIn from './pages/Signin';
import client from './graphql/apolloClient';
import store from './redux/store';
import './App.css';
import Home from './pages/Home';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
