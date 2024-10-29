import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //Burada GetUser decorator'ı kullanılarak kullanıcının bilgileri alınıyor. bunu guarddan dönen request'den de alıyoruz.
  //Getuser dekaratörü jwt strategy den dönen user bilgisini alıyor.
  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Edit user profile' })
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
