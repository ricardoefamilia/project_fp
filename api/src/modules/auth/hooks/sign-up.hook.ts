// import { Injectable } from '@nestjs/common';
// import { Hook, BeforeHook } from '@thallesp/nestjs-better-auth';
// import type { AuthHookContext } from '@thallesp/nestjs-better-auth';
// import { APIError } from 'better-auth/api';

// @Hook()
// @Injectable()
// export class SignUpHook {
//   @BeforeHook('/sign-up/email')
//   async handleSignUp(ctx: AuthHookContext) {
//     const body = ctx.body as { email: string; name: string };

//     // Example: Custom validation logic
//     if (body.email && body.email.includes('+')) {
//       throw new APIError('BAD_REQUEST', {
//         message: 'Email addresses with + signs are not allowed',
//       });
//     }

//     // Example: Validate name length
//     if (body.name && body.name.length < 2) {
//       throw new APIError('BAD_REQUEST', {
//         message: 'Name must be at least 2 characters long',
//       });
//     }

//     // You can also modify the context before it proceeds
//     // ctx.body.name = body.name.trim();
//   }
// }
