/**
 * AnimeMultiFlix - Apple OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-apple';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
    constructor() {
        super({
            clientID: process.env.APPLE_CLIENT_ID || '',
            teamID: process.env.APPLE_TEAM_ID || '',
            keyID: process.env.APPLE_KEY_ID || '',
            privateKeyString: process.env.APPLE_PRIVATE_KEY || '',
            callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback',
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
            const { id, email, name } = profile;
            const userName = name?.firstName 
                ? `${name.firstName}${name.lastName ? ` ${name.lastName}` : ''}`
                : email?.split('@')[0];

            if (!email) {
                return done(new Error('No email found from Apple'), null);
            }

            let user = await User.findOne({ $or: [{ appleId: id }, { email }] });

            if (!user) {
                user = new User({
                    appleId: id,
                    email,
                    username: userName || email.split('@')[0],
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Apple: ${email}`);
            } else if (!user.appleId) {
                user.appleId = id;
                await user.save();
                logger.info(`Apple account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Apple Strategy error:', error);
            return done(error, null);
        }
    }
}

export default AppleStrategy;
