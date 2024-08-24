// CompleteRegistration.jsx - No Node.js-specific modules like `crypto`
import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const CompleteRegistration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    const userId = new URLSearchParams(location.search).get('userId');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/.netlify/functions/completeRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                history.push('/'); // Redirect to dashboard or login after successful registration
            } else {
                setError(data.error || 'Error completing registration.');
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-6">Complete Registration</h2>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Complete Registration
                </button>
            </form>
        </div>
    );
};

export default CompleteRegistration;
