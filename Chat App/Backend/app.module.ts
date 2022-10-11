import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './src/auth/auth.module';
import { UsersModule } from './src/users/users.module';
import { ConversationsModule } from './src/conversations/conversations.module';
import { MessagesModule } from './src/messages/messages.module';
import { GatewayModule } from './src/gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import entities from './src/utils/typeorm';
import { GroupModule } from './src/groups/group.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FriendRequestsModule } from './src/friend-requests/friend-requests.module';
import { FriendsModule } from './src/friends/friends.module';
import { EventsModule } from './src/events/events.module';
import { ThrottlerBehindProxyGuard } from './src/utils/throttler';
import { ExistsModule } from './src/exists/exists.module';
import { MessageAttachmentsModule } from './src/message-attachments/message-attachments.module';

let envFilePath = '.env.development';
if (process.env.ENVIRONMENT === 'PRODUCTION') envFilePath = '.env.production';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      synchronize: true,
      entities,
      logging: false,
    }),
    ConversationsModule,
    MessagesModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    GroupModule,
    FriendRequestsModule,
    FriendsModule,
    EventsModule,
    ExistsModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    MessageAttachmentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
