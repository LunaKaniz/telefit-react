import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // Function to check if the session cookie is set
        const checkLoginStatus = () => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                acc[name] = value;
                return acc;
            }, {});
            setIsLoggedIn(cookies.session ? true : false);
        };

        checkLoginStatus();

        // Listen for changes in the history (i.e., when redirecting back to the home page)
        const unlisten = history.listen(() => {
            checkLoginStatus();
        });

        return () => {
            unlisten();
        };
    }, [history]);

    const handleLogout = () => {
        // Clear the session cookie to log out
        document.cookie = 'session=; Max-Age=-99999999; path=/';
        setIsLoggedIn(false);
        history.push('/'); // Redirect to the home page after logout
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="text-2xl text-blue-700 font-bold">TeleFit</Link>
            </div>
            <div className="flex-none">
                {isLoggedIn ? (
                    <>
                        <Link to="/Settings" className="bg-blue-200 px-3 py-2 rounded-md text-sm text-black me-2">
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-700 px-3 py-2 rounded-md text-sm text-white"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/Login" className="bg-blue-700 px-3 py-2 rounded-md text-sm text-white me-2">
                            Login
                        </Link>
                        <Link to="/Signup" className="bg-blue-200 px-3 py-2 rounded-md text-sm text-black">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
