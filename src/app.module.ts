import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';
import { AppGateway } from './socket/app.gateway';
import { SocketModule } from './socket/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Tüm uygulamada kullanılabilir
    }),
    SocketModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    QuestionsModule,
    CategoriesModule, // Doğru import edildi
  ],
 
})
export class AppModule {}
