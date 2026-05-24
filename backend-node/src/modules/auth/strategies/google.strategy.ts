/**
 * AnimeMultiFlix - Google OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
            scope: ['email', 'profile'],
            passReqToCallback: true
        });
    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        try {
            const { id, name, emails, photos } = profile;
            const email = emails?.[0]?.value;
            const avatar = photos?.[0]?.value;

            if (!email) {
                return done(new Error('No email found from Google'), null);
            }

            let user = await User.findOne({ $or: [{ googleId: id }, { email }] });

            if (!user) {
                user = new User({
                    googleId: id,
                    email,
                    username: email.split('@')[0],
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Google: ${email}`);
            } else if (!user.googleId) {
                user.googleId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`Google account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Google Strategy error:', error);
            return done(error, null);
        }
    }
}

export default GoogleStrategy;
