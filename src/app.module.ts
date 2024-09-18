import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { InterviewModule } from './interview/interview.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
@Module({
  imports: [
    UserModule,
    AuthModule,
    InterviewModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
