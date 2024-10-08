import { useState, useEffect } from 'react';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Adding the Telegram sign-up script
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?7";
        script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_USERNAME); // Use your bot's username
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '5');
        script.setAttribute('data-auth-url', '/.netlify/functions/teleSignup'); // Netlify function URL
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        document.getElementById('telegram-signup').appendChild(script);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/.netlify/functions/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = '/'; // Redirect to the dashboard
            } else {
                alert(data.error || 'Error during signup.');
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-6">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userName" className="block text-gray-700 mb-1">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 mb-1">
                        Password:
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
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </form>

            <div id="telegram-signup" className="mt-4"></div>
        </div>
    );
};

export default Signup;
