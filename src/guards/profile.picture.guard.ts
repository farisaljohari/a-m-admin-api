import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CheckProfilePictureGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      if (req.body) {
        const { profilePicture } = req.body;
        if (profilePicture) {
          const isBase64 = /^data:image\/[a-z]+;base64,/.test(profilePicture);
          if (!isBase64) {
            throw new BadRequestException(
              'Profile picture must be in base64 format.',
            );
          }

          // Get the size of the base64 string (in bytes)
          const base64StringLength =
            profilePicture.length - 'data:image/[a-z]+;base64,'.length;
          const base64ImageSizeInBytes = base64StringLength * 0.75; // Base64 encoding expands data by 33%
          const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

          // Check if the size exceeds the limit
          if (base64ImageSizeInBytes > maxSizeInBytes) {
            throw new BadRequestException(
              'Profile picture size exceeds the allowed limit.',
            );
          }
        }
        // Check if profilePicture is a base64 string
      } else {
        throw new BadRequestException('Invalid request parameters');
      }

      return true;
    } catch (error) {
      console.log('Profile picture guard error: ', error);

      throw error;
    }
  }
}
