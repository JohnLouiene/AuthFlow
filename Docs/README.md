# Auth Flow Project

Simple login/logout to dashboard using authentication, tokenization, validation

* In database schema is where the SQL scripts are, currently using a local postgreSQL server so that may be required to set up. (Will change to docker later so its easier to test)

* Import and install, then use npm run start to start both projects
  
* Uses Redis cloud for refresh tokens, change redis.js to configure (Webhook to connect redis to frontend not completed yet, will test later)
