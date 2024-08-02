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
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)   //bu controller a sadece login olan kullanıcılar erişebilir. @UseGuards(JwtGuard): Bu guard, UserController'a yapılan tüm isteklerde JWT doğrulaması yapar. Bu, sadece geçerli bir JWT'ye sahip kullanıcıların bu controller'a erişebileceği anlamına gelir.
        
@ApiTags('Users') // Burada 'Users' tag'ini ekliyoruz//istenirse direk istek özelinde de kullanılabilir.
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  //Yukarıdaki işlemin aynısını Request objesi ile de yapabiliriz. Özel dekaratörler kullanmamıza gerek yoktur.
  // @Get('me')
  // getMe(@Req() request: Request) {    // Kullanıcı bilgilerini request.user içinden alıyoruz
  //   // Kullanıcı bilgilerini request.user içinden alıyoruz
  //   const user = request.user;
  //   return user;
  // }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
