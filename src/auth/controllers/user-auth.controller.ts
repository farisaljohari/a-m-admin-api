import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAuthService } from '../services/user-auth.service';
import { UserSignUpDto } from '../dtos/user-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../libs/common/src/response/response.decorator';
import { UserLoginDto } from '../dtos/user-login.dto';
import { ForgetPasswordDto, UserOtpDto, VerifyOtpDto } from '../dtos';
import { RefreshTokenGuard } from '@app/common/guards/jwt-refresh.auth.guard';
import { SuperAdminRoleGuard } from 'src/guards/super.admin.role.guard';
import { EnableDisableStatusEnum } from '@app/common/constants/days.enum';
import { OtpType } from '@app/common/constants/otp-type.enum';

@Controller({
  version: EnableDisableStatusEnum.ENABLED,
  path: 'authentication',
})
@ApiTags('Auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @ResponseMessage('User Registered Successfully')
  @Post('user/signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    const signupUser = await this.userAuthService.signUp(userSignUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: {
        id: signupUser.uuid,
        default: () => 'gen_random_uuid()', // this is a default value for the uuid column
      },
      message: 'User Registered Successfully',
    };
  }

  @ResponseMessage('user logged in successfully')
  @Post('user/login')
  async userLogin(@Body() data: UserLoginDto) {
    const accessToken = await this.userAuthService.userLogin(data);
    return {
      statusCode: HttpStatus.CREATED,
      data: accessToken,
      message: 'User Logged in Successfully',
    };
  }

  @Post('user/send-otp')
  async sendOtp(@Body() otpDto: UserOtpDto) {
    const otpCode = await this.userAuthService.generateOTP(otpDto);
    return {
      statusCode: HttpStatus.OK,
      data: {
        ...otpCode,
      },
      message: 'Otp Send Successfully',
    };
  }

  @Post('user/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.userAuthService.verifyOTP(verifyOtpDto);
    return {
      statusCode: HttpStatus.OK,
      data: {},
      message: 'Otp Verified Successfully',
    };
  }

  @Post('user/forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const otpResult = await this.userAuthService.verifyOTP(
      {
        otpCode: forgetPasswordDto.otpCode,
        email: forgetPasswordDto.email,
        type: OtpType.PASSWORD,
      },
      true,
    );
    if (otpResult) {
      await this.userAuthService.forgetPassword(forgetPasswordDto);
      return {
        statusCode: HttpStatus.OK,
        data: {},
        message: 'Password changed successfully',
      };
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {},
      message: 'Otp is incorrect',
    });
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminRoleGuard)
  @Get('user')
  async userList() {
    const userList = await this.userAuthService.userList();
    return {
      statusCode: HttpStatus.OK,
      data: userList,
      message: 'User List Fetched Successfully',
    };
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const refreshToken = await this.userAuthService.refreshToken(
      req.user.uuid,
      req.headers.authorization,
      req.user.type,
      req.user.sessionId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: refreshToken,
      message: 'Refresh Token added Successfully',
    };
  }
}
