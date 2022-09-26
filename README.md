# Bikeramp API

<img src="https://images.unsplash.com/photo-1505872472933-3657fd5f0aa3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=6000" width="600" alt="Nest Logo" />

### 👋 Hi there 
This is my Bikeramp API implementation.

### :satellite: Tech stack : 
TypeScript, Nest.js, TypeORM, PostgreSQL, moment.js

### :bricks: Env setup :
Copy & rename <ins>env.example</ins> file into <ins>.env</ins> file, and provide your values.

### :bookmark_tabs: Installation  :
Nest.js app is using PostgreSQL as a database, so it has to be installed on your computer, and then:
```
$ CREATE DATABASE bikes;
$ CREATE USER rider WITH ENCRYPTED PASSWORD 'test12345';
$ GRANT ALL PRIVILEGES ON DATABASE bikes TO rider;
```

Install dependencies: <br />
```
$ npm install 
```

Start app: <br />
```
$ npm run start:dev
```
### :wrench: Running tests
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```
