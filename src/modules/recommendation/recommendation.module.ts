import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { RecommendationRepository } from './recommendation.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  providers: [RecommendationService, RecommendationRepository],
  controllers: [RecommendationController],
  imports: [PrismaModule, VendorModule],
})
export class RecommendationModule {}