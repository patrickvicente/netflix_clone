import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebase';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './screens/ProfileScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './app/store';

const router = createBrowserRouter([
  {path: "*", Component: Root},
]);

function Root() {
  const user = useSelector(selectUser);
  console.log("User state:", user);
  const dispatch = useDispatch();

  // This is used to stay logged in after signing in
  useEffect(() => {
    // unsubscribe is the cleanup method
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // Logged In
        console.log("User Authenticated:", userAuth);
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        }));
      } else {
        // Logged out
        console.log("User notAuthenticated:", userAuth);
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
      <div className="app">
        {user ? (
          <Routes>
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/' element={<HomeScreen />} />
          </Routes>
        ) : (
          <LoginScreen />
        )}
      </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}