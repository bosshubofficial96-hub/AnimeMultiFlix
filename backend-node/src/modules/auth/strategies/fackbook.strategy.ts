/**
 * AnimeMultiFlix - Facebook OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
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
            const { id, emails, name, photos } = profile;
            const email = emails?.[0]?.value;
            const avatar = photos?.[0]?.value;

            if (!email) {
                return done(new Error('No email found from Facebook'), null);
            }

            let user = await User.findOne({ $or: [{ facebookId: id }, { email }] });

            if (!user) {
                user = new User({
                    facebookId: id,
                    email,
                    username: email.split('@')[0],
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Facebook: ${email}`);
            } else if (!user.facebookId) {
                user.facebookId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`Facebook account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Facebook Strategy error:', error);
            return done(error, null);
        }
    }
}

export default FacebookStrategy;
