import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { RpcModule } from './rpc/rpc.module';
import { AuthGuard, CustomAuthModule, CustomConfigModule, DatabaseModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [HttpModule, RpcModule, CustomConfigModule, CustomAuthModule, DatabaseModule.forRoot()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ReasonsModule {}
