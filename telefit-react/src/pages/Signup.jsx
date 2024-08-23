// Signup.jsx
import { useState } from 'react';

const Signup = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/signup/email', {
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
      alert(data.msg || 'Error during signup.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-6">Sign Up</h2>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium mb-2">Sign Up with Telegram</h3>
        <script
          async
          src={`https://telegram.org/js/telegram-widget.js?7`}
          data-telegram-login={import.meta.env.VITE_TELEGRAM_BOT_USERNAME}
          data-size="large"
          data-radius="5"
          data-auth-url="/telegram/signup-callback"
          data-request-access="write"
        ></script>
      </div>

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
    </div>
  );
};

export default Signup;
