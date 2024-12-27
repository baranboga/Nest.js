import { forwardRef, Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [forwardRef(() => CategoriesModule)],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class SocketModule {}



