import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,

            // 🔥 AQUI ESTÁ A CORREÇÃO
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,

                jwksUri: 'https://ncepqcrmsxijlwbkhmoy.supabase.co/auth/v1/.well-known/jwks.json',
            }),

            algorithms: ['ES256'],
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}