### First Step

- Install Node JS

###### Run

```bash
npm install
```

### Env Setup

- NODE_ENV=production
- PORT=

###### Domain name is important for image link generation and cookie

- DOMAIN_NAME=

###### Secret Token Creation (Do this 3 times for access token, refresh token and reset token)

```javascript
// Go into node repl by typing node and then type the command below
require('crypto').randomBytes(64).toString('hex')
```

- ACCESS_TOKEN_SECRET=
- REFRESH_TOKEN_SECRET=
- RESET_TOKEN_SECRET=

###### PostgreSql Database

- DATABASE_URL=postgresql://user:password@database:5432/school_db?schema=public

###### Email Setup

- MAIL_HOST=
- MAIL_PORT=
- MAIL_USER=
- MAIL_PASSWORD=
- MAIL_SENDER=

### Final Commands (Database migration, database seed and starting the server)

```bash
npx prisma db push
npx prisma db seed
npm run prod
```
