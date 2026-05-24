/**
 * AnimeMultiFlix - Twitch OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-twitch';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
    constructor() {
        super({
            clientID: process.env.TWITCH_CLIENT_ID || '',
            clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
            callbackURL: process.env.TWITCH_CALLBACK_URL || '/api/auth/twitch/callback',
            scope: ['user:read:email'],
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
            const { id, login, email, profile_image_url } = profile;
            const username = login || email?.split('@')[0];

            if (!email) {
                return done(new Error('No email found from Twitch'), null);
            }

            let user = await User.findOne({ $or: [{ twitchId: id }, { email }] });

            if (!user) {
                user = new User({
                    twitchId: id,
                    email,
                    username: username,
                    avatar: profile_image_url,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Twitch: ${email}`);
            } else if (!user.twitchId) {
                user.twitchId = id;
                if (!user.avatar && profile_image_url) user.avatar = profile_image_url;
                await user.save();
                logger.info(`Twitch account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Twitch Strategy error:', error);
            return done(error, null);
        }
    }
}

export default TwitchStrategy;
