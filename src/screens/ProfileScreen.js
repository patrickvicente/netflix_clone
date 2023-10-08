import React from 'react';
import "./ProfileScreen.css";
import Nav from '../Nav';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import PlansScreen from './PlansScreen';

function ProfileScreen() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Sign Out Successful");
                navigate('/');
            })
            .catch((error) => {
                console.error("Sign out error", error);
            });
    }

  return (
    <div className="profileScreen">
        <Nav />
        <div className="profileScreen__body">
            <h1>Edit Profile</h1>
            <div className="profileScreen__info">
                <img 
                src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' 
                alt='netflix user avatar' 
                />

                <div className="profileScreen__details">
                    <h2>{user.email}</h2>
                    <div className="profileScreen__plans">
                        <h3>Plans</h3>

                        <PlansScreen />
                        <button 
                        onClick={handleSignOut}
                        className='profileScreen__signOut'>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileScreen