/**
 * AnimeMultiFlix - LinkedIn OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
    constructor() {
        super({
            clientID: process.env.LINKEDIN_CLIENT_ID || '',
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
            callbackURL: process.env.LINKEDIN_CALLBACK_URL || '/api/auth/linkedin/callback',
            scope: ['r_emailaddress', 'r_liteprofile'],
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
                return done(new Error('No email found from LinkedIn'), null);
            }

            let user = await User.findOne({ $or: [{ linkedinId: id }, { email }] });

            if (!user) {
                user = new User({
                    linkedinId: id,
                    email,
                    username: email.split('@')[0],
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via LinkedIn: ${email}`);
            } else if (!user.linkedinId) {
                user.linkedinId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`LinkedIn account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('LinkedIn Strategy error:', error);
            return done(error, null);
        }
    }
}

export default LinkedInStrategy;
