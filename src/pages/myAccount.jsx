
import MyAds from "../components/myAds";
import React from 'react';
import UserDashboard from "../components/userDashboard";


const MyAccount = () => {
    return (
        <div>
            <UserDashboard/>
            <MyAds/>
        </div>
    );
};

export default MyAccount;