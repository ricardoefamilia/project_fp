import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://localhost:3000/oauth2/authorize', () => {
    return HttpResponse.json({
      code: '1234567890',
      state: '1234567890',
      scope: 'openid profile email',
      redirect_uri: 'http://localhost:3000/oauth2/callback',
      response_type: 'code',
      client_id: '1234567890',
      client_secret: '1234567890',
      grant_type: 'authorization_code',
    });
  }),
];
