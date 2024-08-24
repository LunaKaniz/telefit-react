import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import User from '../../models/Users.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const { email, password } = JSON.parse(event.body);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid email or password' }),
            };
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid email or password' }),
            };
        }

        // If email and password are correct, create a session cookie
        const sessionCookie = cookie.serialize('session', JSON.stringify({
            userId: user._id,
            userName: user.userName,
        }), {
            httpOnly: false, // Secure the cookie
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60, // 1 day
            path: '/',
            sameSite: 'strict',
        });

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': sessionCookie,
                Location: '/', // Redirect to the home page or another appropriate page
            },
        };
    } catch (error) {
        console.error('Error during login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    } finally {
        mongoose.connection.close();
    }
}
