/**
 * AnimeMultiFlix - GitHub OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor() {
        super({
            clientID: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
            scope: ['user:email'],
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
            const { id, username, emails, photos } = profile;
            const email = emails?.[0]?.value;
            const avatar = photos?.[0]?.value;

            if (!email) {
                return done(new Error('No email found from GitHub'), null);
            }

            let user = await User.findOne({ $or: [{ githubId: id }, { email }] });

            if (!user) {
                user = new User({
                    githubId: id,
                    email,
                    username: username || email.split('@')[0],
                    avatar,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via GitHub: ${email}`);
            } else if (!user.githubId) {
                user.githubId = id;
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
                logger.info(`GitHub account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('GitHub Strategy error:', error);
            return done(error, null);
        }
    }
}

export default GitHubStrategy;
