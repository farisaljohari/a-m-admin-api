import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/common/modules/user/repositories';
import { ConfigService } from '@nestjs/config';
import { HelperHashService } from '../../helper/services';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly helperHashService: HelperHashService,
  ) {}

  async createSuperAdminIfNotFound(): Promise<void> {
    try {
      // Get the super admin email from config
      const superAdminEmail = this.configService.get<string>(
        'super-admin.SUPER_ADMIN_EMAIL',
      );

      // Check if a user with the super admin email already exists
      const superAdmin = await this.userRepository.findOne({
        where: { email: superAdminEmail },
      });

      if (!superAdmin) {
        // Create the super admin user if not found
        console.log('Creating super admin user...');
        await this.createSuperAdmin();
      } else {
        console.log(
          'Super admin user already exists. Checking for password update...',
        );
        await this.updateSuperAdminPasswordIfChanged(superAdmin);
      }
    } catch (err) {
      console.error('Error while checking super admin:', err);
      throw err;
    }
  }

  private async createSuperAdmin(): Promise<void> {
    const salt = this.helperHashService.randomSalt(10); // Generate a random salt
    const hashedPassword = await this.helperHashService.bcrypt(
      this.configService.get<string>('super-admin.SUPER_ADMIN_PASSWORD'),
      salt,
    );

    try {
      await this.userRepository.save({
        email: this.configService.get<string>('super-admin.SUPER_ADMIN_EMAIL'),
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        isUserVerified: true,
        isActive: true,
      });
      console.log('Super admin user created successfully.');
    } catch (err) {
      console.error('Error while creating super admin:', err);
      throw err;
    }
  }

  private async updateSuperAdminPasswordIfChanged(
    superAdmin: any,
  ): Promise<void> {
    const newPassword = this.configService.get<string>(
      'super-admin.SUPER_ADMIN_PASSWORD',
    );
    const salt = this.helperHashService.randomSalt(10);
    const newHashedPassword = await this.helperHashService.bcrypt(
      newPassword,
      salt,
    );

    // Check if the current password in the DB is different from the new password
    const isPasswordDifferent = !(await this.helperHashService.compare(
      newPassword,
      superAdmin.password,
    ));

    if (isPasswordDifferent) {
      console.log('Updating super admin password...');
      superAdmin.password = newHashedPassword;
      await this.userRepository.save(superAdmin);
      console.log('Super admin password updated successfully.');
    } else {
      console.log('No password update needed.');
    }
  }
}
