/**
 * AnimeMultiFlix - Twitter OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-twitter';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: process.env.TWITTER_CONSUMER_KEY || '',
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '',
            callbackURL: process.env.TWITTER_CALLBACK_URL || '/api/auth/twitter/callback',
            includeEmail: true,
            passReqToCallback: true
        });
    }

    async validate(
        req: any,
        token: string,
        tokenSecret: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        try {
            const { id, username, emails, photos } = profile;
            const email = emails?.[0]?.value;
            const avatar = photos?.[0]?.value;

            if (!email) {
                return done(new Error('No email found from Twitter'), null);
            }

            let user = await User.findOne({ $or: [{ twitterId: id }, { email }] });

            if (!user) {
                user = new User({
                    twitterId: id,
                    email,
                    username: username || email.split('@')[0],
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Twitter: ${email}`);
            } else if (!user.twitterId) {
                user.twitterId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`Twitter account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Twitter Strategy error:', error);
            return done(error, null);
        }
    }
}

export default TwitterStrategy;
