import mongoose from 'mongoose';
import crypto from 'crypto';
import cookie from 'cookie';
import User from '../../models/Users.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

export async function handler(event) {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    console.log("Starting Telegram signup process...");

    try {
        const { id, first_name, last_name, username, hash } = event.queryStringParameters;

        // Validate the Telegram data using the bot's token
        const secretKey = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
        const dataCheckString = Object.keys(event.queryStringParameters)
            .filter(key => key !== 'hash')
            .map(key => `${key}=${event.queryStringParameters[key]}`)
            .sort()
            .join('\n');

        const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        console.log("Hash comparison result:", computedHash === hash);

        if (computedHash !== hash) {
            console.error("Invalid Telegram authentication.");
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Invalid Telegram authentication' }),
            };
        }

        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB. Checking for existing Telegram ID...");

        // Check if the Telegram ID already exists
        let user = await User.findOne({ telegramId: id });
        console.log("User found:", user);  // Log the result of the database query

        if (user) {
            console.log("Telegram ID already exists. Redirecting to login page.");
            return {
                statusCode: 302,
                headers: {
                    Location: '/login', // Redirect to login page or another appropriate page
                },
                body: JSON.stringify({ message: 'Telegram ID already registered. Please log in.' }),
            };
        }

        // If the Telegram ID does not exist, create a new user
        console.log("Telegram ID not found. Creating new user...");
        user = new User({
            telegramId: id,
            firstName: first_name,
            lastName: last_name,
            userName: username,
            email: null, // Can be set later
            password: null, // Can be set later
            registrationComplete: false,
        });
        await user.save();

        console.log("User created successfully.");

        // Create a session cookie
        const sessionCookie = cookie.serialize('session', JSON.stringify({
            userId: user._id,
            userName: user.userName,
        }), {
            httpOnly: false, // Allows access via JavaScript
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60, // 1 day
            path: '/',
            sameSite: 'strict',
        });

        console.log("Session cookie created. Redirecting to complete registration.");

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': sessionCookie,
                Location: '/complete-registration?userId=' + user._id, // Redirect to complete registration page
            },
            body: JSON.stringify({ message: 'User created successfully', userId: user._id }),
        };
    } catch (error) {
        console.error('Error during Telegram sign-up:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    } finally {
        // Close the MongoDB connection
        console.log("Closing MongoDB connection.");
        mongoose.connection.close();
    }
}
