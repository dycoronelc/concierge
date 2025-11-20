import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICD10Controller } from './icd10.controller';
import { ICD10Service } from './icd10.service';
import { ICD10 } from '../../entities/icd10.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ICD10])],
  controllers: [ICD10Controller],
  providers: [ICD10Service],
  exports: [ICD10Service],
})
export class ICD10Module {}

