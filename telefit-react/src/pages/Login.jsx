import  { useState, useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Adding the Telegram login script
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?7";
        script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_USERNAME); // Use your bot's username
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '5');
        script.setAttribute('data-auth-url', '/auth/telegram/callback'); // Replace with your auth URL
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        document.getElementById('telegram-login').appendChild(script);
    }, []);

    console.log(import.meta.env.REACT_APP_TELEGRAM_BOT_USERNAME);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log({ email, password });

        // Example: Send login request
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle success or error
            console.log(data);
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
    };

    return (

        <section className="main-section">
            <h2 className="text-2xl mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="p-2 border border-gray-300 rounded w-full" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 mb-1">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
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
                    Login
                </button>
            </form>

            <div id="telegram-login" className="mt-4"></div>
        </section>
    );
};

export default Login;
