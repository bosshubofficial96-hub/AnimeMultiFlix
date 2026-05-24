/**
 * AnimeMultiFlix - Reddit OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-reddit';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class RedditStrategy extends PassportStrategy(Strategy, 'reddit') {
    constructor() {
        super({
            clientID: process.env.REDDIT_CLIENT_ID || '',
            clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
            callbackURL: process.env.REDDIT_CALLBACK_URL || '/api/auth/reddit/callback',
            scope: ['identity', 'read'],
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
            const { id, name } = profile;
            const email = `${name}@reddit.com`;
            const avatar = profile._json?.snoovatar_img || null;

            let user = await User.findOne({ $or: [{ redditId: id }, { email }] });

            if (!user) {
                user = new User({
                    redditId: id,
                    email,
                    username: name,
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Reddit: ${name}`);
            } else if (!user.redditId) {
                user.redditId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`Reddit account linked to user: ${name}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Reddit Strategy error:', error);
            return done(error, null);
        }
    }
}

export default RedditStrategy;
