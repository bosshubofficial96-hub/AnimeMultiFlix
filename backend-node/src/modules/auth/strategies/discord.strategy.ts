/**
 * AnimeMultiFlix - Discord OAuth Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, VerifyCallback } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../auth.model';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor() {
        super({
            clientID: process.env.DISCORD_CLIENT_ID || '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
            callbackURL: process.env.DISCORD_CALLBACK_URL || '/api/auth/discord/callback',
            scope: ['identify', 'email'],
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
            const { id, username, email, avatar } = profile;
            const avatarUrl = avatar 
                ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
                : null;

            if (!email) {
                return done(new Error('No email found from Discord'), null);
            }

            let user = await User.findOne({ $or: [{ discordId: id }, { email }] });

            if (!user) {
                user = new User({
                    discordId: id,
                    email,
                    username: username || email.split('@')[0],
                    avatar: avatarUrl,
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true
                });
                await user.save();
                logger.info(`New user created via Discord: ${email}`);
            } else if (!user.discordId) {
                user.discordId = id;
                if (!user.avatar && avatarUrl) user.avatar = avatarUrl;
                await user.save();
                logger.info(`Discord account linked to user: ${email}`);
            }

            return done(null, user);
        } catch (error) {
            logger.error('Discord Strategy error:', error);
            return done(error, null);
        }
    }
}

export default DiscordStrategy;
