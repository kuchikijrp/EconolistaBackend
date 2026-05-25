import {
    BadRequestException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';

import { StripeService } from '@/common/stripe.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private stripe: StripeService
    ) { }

    async findOrCreateProfile(supabaseUser: any) {

        if (!supabaseUser?.email) {
            throw new BadRequestException(
                'Email missing from token'
            );
        }

        let user = await this.prisma.user.findUnique({
            where: {
                id: supabaseUser.id
            }
        });

        // 🔥 PRIMEIRO LOGIN
        if (!user) {

            const stripeCustomer =
                await this.stripe.createCustomer(
                    supabaseUser.email
                );

            user = await this.prisma.user.create({
                data: {
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    name: supabaseUser.name ?? null,

                    stripeCustomerId:
                        stripeCustomer.id,

                    planStatus: 'FREE',

                    points: 0,
                    totalXp: 0,
                    level: 0,
                }
            });
        }

        return {
            id: user.id,
            name: user.name,

            email: user.email,

            points: user.points,

            level: user.level,

            planStatus: user.planStatus,

            stripeCustomerId:
                user.stripeCustomerId,

            gamification:
                this.getLevelProgress(
                    user.totalXp ?? 0
                )
        };
    }


    // 🔥 Fórmula de nível
    calculateLevel(totalXp: number): number {
        if (totalXp <= 0) return 0;

        return Math.floor(
            Math.sqrt(totalXp / 100)
        );
    }

    // 🔥 Dados completos do progresso
    getLevelProgress(totalXp: number) {

        const currentLevel =
            this.calculateLevel(totalXp);

        const currentLevelXp =
            Math.pow(currentLevel, 2) * 100;

        const nextLevel =
            currentLevel + 1;

        const nextLevelXp =
            Math.pow(nextLevel, 2) * 100;

        const xpToNextLevel =
            nextLevelXp - totalXp;

        const xpInsideLevel =
            totalXp - currentLevelXp;

        const xpRequiredThisLevel =
            nextLevelXp - currentLevelXp;

        const progressPercent =
            xpRequiredThisLevel <= 0
                ? 100
                : Number(
                    (
                        (xpInsideLevel / xpRequiredThisLevel) * 100
                    ).toFixed(2)
                );

        return {
            currentLevel,
            totalXp,
            currentLevelXp,
            nextLevelXp,
            xpToNextLevel,
            progressPercent,
        };
    }
}