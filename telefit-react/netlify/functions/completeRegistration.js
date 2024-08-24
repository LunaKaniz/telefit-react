import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import User from '../../models/Users.js';
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
        const { userId, email, password } = JSON.parse(event.body);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user || user.registrationComplete) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid user or registration already completed.' }),
            };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user with email and password, and mark registration as complete
        user.email = email;
        user.password = hashedPassword;
        user.registrationComplete = true;

        await user.save();

        // Manually create a session cookie
        const sessionCookie = cookie.serialize('session', JSON.stringify({
            userId: user._id,
            userName: user.userName,
            email: user.email
        }), {
            httpOnly: false, // Helps prevent XSS attacks by making the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Secure in production
            maxAge: 24 * 60 * 60, // 1 day
            path: '/', // Available across the entire site
            sameSite: 'strict', // Prevents the browser from sending this cookie along with cross-site requests
        });

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': sessionCookie,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Registration completed successfully', userId: user._id }),
        };
    } catch (error) {
        console.error('Error completing registration:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}
