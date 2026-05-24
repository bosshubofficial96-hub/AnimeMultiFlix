/**
 * AnimeMultiFlix - JWT Strategy
 * Version: 4.0.0 (2026)
 */

import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../auth.model';
import { ITokenPayload } from '../auth.interfaces';
import { logger } from '../../../shared/utils/logger';

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req?.cookies?.access_token || null,
        (req) => req?.query?.token || null
    ]),
    secretOrKey: process.env.JWT_SECRET || 'default-jwt-secret',
    issuer: process.env.JWT_ISSUER || 'animemultiflix',
    audience: process.env.JWT_AUDIENCE || 'animemultiflix-api',
    ignoreExpiration: false,
    passReqToCallback: true
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super(jwtOptions);
    }

    async validate(req: any, payload: ITokenPayload): Promise<any> {
        try {
            const user = await User.findById(payload.userId)
                .select('-password -verificationToken -resetPasswordToken')
                .lean();

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('Account is inactive');
            }

            if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
                throw new UnauthorizedException('Account is locked');
            }

            req.user = user;
            req.tokenPayload = payload;
            req.sessionId = payload.sessionId;

            return user;
        } catch (error) {
            logger.error('JWT Strategy validation error:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}

export default JwtStrategy;
