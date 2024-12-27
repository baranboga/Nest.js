import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SocketModule } from 'src/socket/app.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
