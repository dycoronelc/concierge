import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutricionController } from './nutricion.controller';
import { NutricionService } from './nutricion.service';
import { EvaluacionNutricional } from '../../entities/evaluacion-nutricional.entity';
import { PlanNutricional } from '../../entities/plan-nutricional.entity';
import { SeguimientoNutricional } from '../../entities/seguimiento-nutricional.entity';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EvaluacionNutricional,
      PlanNutricional,
      SeguimientoNutricional,
      Patient,
      User,
    ]),
  ],
  controllers: [NutricionController],
  providers: [NutricionService],
  exports: [NutricionService],
})
export class NutricionModule {}

