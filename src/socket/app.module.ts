import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [CategoriesModule],
  providers: [AppGateway],
})
export class SocketModule {}
