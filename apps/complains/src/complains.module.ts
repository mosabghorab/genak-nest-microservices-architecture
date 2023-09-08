import { Module } from '@nestjs/common';
import { AuthGuard, CustomAuthModule, CustomConfigModule, DatabaseModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from './http/http.module';
import { RpcModule } from './rpc/rpc.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), HttpModule, RpcModule, CustomConfigModule, CustomAuthModule, DatabaseModule.forRoot()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ComplainsModule {}
