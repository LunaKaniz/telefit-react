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

        if (computedHash !== hash) {
            return {
                statusCode: 403,
                body: 'Invalid Telegram authentication',
            };
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        // Check if user exists
        const user = await User.findOne({ telegramId: id });

        if (!user) {
            // Redirect to the signup page if the user does not exist
            return {
                statusCode: 302,
                headers: {
                    Location: '/signup', // Adjust this path based on your signup page route
                },
            };
        }

        // Log them in by setting the session
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
        console.error('Error during Telegram login:', error);
        return {
            statusCode: 500,
            body: 'Error during Telegram authentication',
        };
    } finally {
        mongoose.connection.close();
    }
}
