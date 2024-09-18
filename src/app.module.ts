import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { InterviewModule } from './interview/interview.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';
@Module({
  imports: [
    UserModule,
    AuthModule,
    InterviewModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
