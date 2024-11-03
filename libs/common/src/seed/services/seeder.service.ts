import { Injectable } from '@nestjs/common';
import { SuperAdminSeeder } from './supper.admin.seeder';
@Injectable()
export class SeederService {
  constructor(private readonly superAdminSeeder: SuperAdminSeeder) {}

  async seed() {
    await this.superAdminSeeder.createSuperAdminIfNotFound();
  }
}
