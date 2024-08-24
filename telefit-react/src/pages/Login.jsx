import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    useEffect(() => {
        // Add Telegram login widget
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?7";
        script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_USERNAME); // Use your bot's username
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-auth-url', '/.netlify/functions/teleLogin'); // The Netlify function that handles Telegram login
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        document.getElementById('telegram-login').appendChild(script);
    }, []);

    const handleManualLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/.netlify/functions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                history.push('/');
            } else {
                console.error('Failed to login manually');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-6">Login</h2>

            <form onSubmit={handleManualLogin} className="mb-4">
                <div className="mb-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>

            <div id="telegram-login" className="mt-6"></div>
        </div>
    );
}
