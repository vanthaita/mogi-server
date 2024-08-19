import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { InterviewModule } from './interview/interview.module';
import { ConfigModule } from '@nestjs/config';
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
  providers: [],
})
export class AppModule {}
