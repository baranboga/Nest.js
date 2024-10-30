import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

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

  @ApiOperation({ summary: 'Update a user with bookmarks' })
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) userId: number, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  @ApiOperation({ summary: 'Create a new user with bookmarks' })
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
