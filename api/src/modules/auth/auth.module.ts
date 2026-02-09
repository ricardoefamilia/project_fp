import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule, AuthGuard } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
// import { SignUpHook } from './hooks/sign-up.hook';
// import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    BetterAuthModule.forRoot(auth, {
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
    }),
  ],
  // providers: [AuthGuard],
  exports: [BetterAuthModule],
})
export class AuthModule {}
