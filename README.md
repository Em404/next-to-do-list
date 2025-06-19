## Getting Started

After cloning the repo run

```bash
npm i
# or
npm install
```

Create the .env file in the root folder in which to declare the following environment variables:

DATABASE_URL=""

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""

CLERK_SECRET_KEY=""

NEXT_PUBLIC_CLERK_SIGN_IN_URL=""

NEXT_PUBLIC_CLERK_SIGN_UP_URL=""

For more info you can follow the following docs:
- Clerk: https://clerk.com/docs
- Prisma: https://www.prisma.io/docs

Start the db with Docker via app or command line using:
```bash
docker-compose up
```

Then you can proceed with
```bash
npx prisma generate
```

At this point, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
