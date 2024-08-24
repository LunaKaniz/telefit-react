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
        const { userName, email, password } = JSON.parse(event.body);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User already exists' }),
            };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        user = new User({
            userName,
            email,
            password: hashedPassword,
            registrationComplete: true, // Mark registration as complete
        });
        await user.save();

        // Manually create a session cookie
        const sessionCookie = cookie.serialize('session', JSON.stringify({
            userId: user._id,
            userName: user.userName,
            email: user.email
        }), {
            httpOnly: false, // Helps prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // Secure in production
            maxAge: 24 * 60 * 60, // 1 day
            path: '/', // Available across the entire site
            sameSite: 'strict', // Prevents cross-site request
        });

        return {
            statusCode: 201,
            headers: {
                'Set-Cookie': sessionCookie,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'User created successfully', userId: user._id }),
        };
    } catch (error) {
        console.error('Error during sign-up:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}
