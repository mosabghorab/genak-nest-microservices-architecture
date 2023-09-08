import { Module } from '@nestjs/common';
import { AuthGuard, CustomAuthModule, CustomConfigModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from './http/http.module';
import { RpcModule } from './rpc/rpc.module';

@Module({
  imports: [HttpModule, RpcModule, CustomConfigModule, CustomAuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ReportsModule {}
