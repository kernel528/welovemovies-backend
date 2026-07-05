# Capstone Project Logs

This file captures historical setup notes, route task logs, and deployment transcripts that were originally embedded in README.md.

### Database Setup
- For local testing, I am using a docker-based database setup on a host called `swarm-m3` with a new database called: `chegg_welovemovies_dev` (Postgres 18).
- For remote/deployment, I use a `Render` hosted DB instance (Postgres 18).

Local DB Setup with Docker
1. Launch docker `psql` container and create DB:
    ```bash
    docker container run -it --rm --name postgres-psql-swarm --platform=linux/amd64 kernel528/postgres:18-arm64 psql -h 192.168.1.33 -U postgres -d chegg_books_dev
    chegg_books_dev=# CREATE DATABASE chegg_welovemovies_dev;
    CREATE DATABASE
    chegg_books_dev=# \l
    List of databases
    Name          |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges
    ------------------------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
    chegg_books            | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    chegg_books_dev        | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    chegg_dev              | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    chegg_mock_practice    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    chegg_node_dev         | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    chegg_welovemovies_dev | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    postgres               | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
    template0              | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
    |          |          |                 |            |            |            |           | postgres=CTc/postgres
    template1              | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
    |          |          |                 |            |            |            |           | postgres=CTc/postgres
    (9 rows)
    ```
2. Setup `DBeaver` connection to be able to test/validate DB updates.
3. Run `npm install` to install packages.  Then attempt to startup app as is:
   ```bash
   : npm run start:dev
   
   > project-movie-back-end@1.0.0 start:dev
   > nodemon src/server.js
   
   [nodemon] 2.0.22
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching path(s): *.*
   [nodemon] watching extensions: js,mjs,json
   [nodemon] starting `node src/server.js`
   Error: connect ECONNREFUSED ::1:5432
       at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16) {
     errno: -61,
     code: 'ECONNREFUSED',
     syscall: 'connect',
     address: '::1',
     port: 5432
   }
   [nodemon] clean exit - waiting for changes before restart
   
   ```
4. Setup `knex` integration
5. Setup the `db/migrations` 
   ```bash
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1 on git:database-setup [2025-01-17 17:33:06] C:1 
   : npx knex migrate:make createCriticsTable
   Using environment: development
   Using environment: development
   Using environment: development
   Created Migration: /Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1/src/db/migrations/20250117174804_createCriticsTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1 on git:database-setup x [2025-01-17 17:48:04]
   : npx knex migrate:make createMoviesTable 
   Using environment: development
   Using environment: development
   Using environment: development
   Created Migration: /Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1/src/db/migrations/20250117174832_createMoviesTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1 on git:database-setup x [2025-01-17 17:48:32]
   : npx knex migrate:make createTheatersTable
   Using environment: development
   Using environment: development
   Using environment: development
   Created Migration: /Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1/src/db/migrations/20250117174844_createTheatersTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1 on git:database-setup x [2025-01-17 17:48:44]
   : npx knex migrate:make createReviewsTable 
   Using environment: development
   Using environment: development
   Using environment: development
   Created Migration: /Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1/src/db/migrations/20250117174852_createReviewsTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1 on git:database-setup x [2025-01-17 17:48:52]
   : npx knex migrate:make createMovies_TheatersTable
   Using environment: development
   Using environment: development
   Using environment: development
   Created Migration: /Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1/src/db/migrations/20250117174906_createMovies_TheatersTable.js
   ```
6. Customize/Update the `db/migrations` files.
7. Run the migrations.  Note: Because I had the API server running in `dev` mode it picked up the migration files originally when created.  Had to delete the original `knex_migrations` tables.
   ```bash
   : npx knex migrate:list  
   Using environment: development
   No Completed Migration files Found. 
   Found 5 Pending Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   
   : npx knex migrate:latest
   Using environment: development
   Batch 1 run: 5 migrations
   ```
8. This indicates it ran fine and checking `dbeaver` shows the tables were created.  The `npm test` failed as this uses sqllite for in-memory testing.
9. Seed the data:
   ```bash
   : npx knex seed:run
   Using environment: development
   Ran 6 seed files
   ```
   - After seeding the files I ran some `select` queries using `dbeaver` and confirmed data loaded.

### Movie Routes
1. Task 1:  GET /movies (all)
   - Updated the `movies.controller.js` list function.  Enabled route in `movies.router.js`.  The `movies.service.js` was already setup for list (get all).
   - When opening browser to http://localhost:5001/movies all movies were returned from `dev` database.
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       11 failed, 1 passed, 12 total
     ```
2. Task 2: GET /movies?is_showing=true
   - Updated the `movies.controller.js` list function to include a check for `is_showing` in the `query.params` and if true, then return only those movies.
   - When opening browser to http://localhost:5001/movies?is_showing=true the output is sorted differently.  Same with `postman`.
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       10 failed, 2 passed, 12 total
     ```
3. Task 3: GET /movies/:movieId
   - Updated the `movies.controller.js` with code for checking if movie exists (`movieExists`) and enabled route in `movies.router.js` and updated `movies.service.js` read query.
   - Validated with browser route to `movies/:movie_id` and `postman` READ.
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       9 failed, 3 passed, 12 total
     ```
4. Task 4: GET /movies/:movie_id invalid ID
   - Updated the `movies.controller.js` movieExists function with correct message.  Added custom `errorHandler.js` to `errors` and updated the `app.js` to use this.
   - Validated with `postman` by using invalid movie_id.
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       8 failed, 4 passed, 12 total
     ```
5. Task 5: GET /movies/:movie_id/theaters
   - Updated the `movies.router.js` to add the `/movies/:movie_id/theaters` route with `theatersRouter` callback.
   - Then updated the `theaters.controller.js` to assign the `movie_id` and send to the `theaters.service.list(movie_id)` in the `list` function.
   - Then updated the `theaters.router.js` file to enable the route.
   - Validated with browser and `postman` by going to the `/movies/1/theaters` route...
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       7 failed, 5 passed, 12 total
     ```
6. Task 6: GET /movies/:movie_id/reviews
   - Updated `movies` and `reviews` src files to support returning reviews data properly in the `/movies/:movie_id/reviews` route.
   - Fixed an issue with the `down` in the createTheatersTable migration file.
   - Validated with `postman` proper 200 response with review data.
   - Ran `npm test` to check test status:
     ```bash
      Test Suites: 3 failed, 3 total
      Tests:       6 failed, 6 passed, 12 total
     ```
7. Task 7: should not include critics anywhere for the path `/movies/:movieId/critics`
   - Had to update the `movies.router.js` file to include a catch-all handler for `/movies/:movie_id/*` not defined as valid.
   - Validate with `postman` that going to `/movies/:movie_id/reviews` works as expected but something like `/movies/:movie_id/critics` returns a 404 error.
   - Ran `npm test` to check test status:
     ```bash
      PASS  test/routes/movies.test.js
      
      Test Suites: 2 failed, 1 passed, 3 total
      Tests:       5 failed, 7 passed, 12 total
     ```

### Theater Routes
1. Task 1:  GET /theaters (list, all)
   - Updated the `/src/app.js` file  to enable the `/theaters` route.  This was the only change needed due to `/movies` route enablement tasks.
   - Validated with web browser and `postman` using the http://localhost:5001/theaters route.
   - Ran `npm test` to check test status:
     ```bash
      PASS  test/routes/theaters.test.js
      PASS  test/routes/movies.test.js
   
      Test Suites: 1 failed, 2 passed, 3 total
      Tests:       4 failed, 8 passed, 12 total
     ```

### Review Routes
1. Task 1: UPDATE /reviews/:reviewId (PUT), UPDATE /reviews/:reviewId (incorrect ID)
   - Updated the `src/reviews/reviews.controller.js` for the `reviewExists` middleware and `update` function.  
   - Updated the `src/reviews/reviews.router.js` to enable the `"/:review_id"` route for `PUT` method.
   - Updated the `src/reviews/reviews.service.js` for the `read` function.  The `updated` and other middleware checks were good.
2. Task 2: DELETE /reviews/:reviewId (DELETE), DELETE /reviews/:reviewId (incorrect ID)
   - Updated the `src/reviews/reviews.controller.js` for the `destroy` function.
   - Updated the `src/reviews/reviews.router.js` to enable the `"/:review_id"` route for `DELETE` method.
   - Updated the `src/reviews/reviews.service.js` for the `destroy` function.  The other middleware checks were good.

### General Tasks
Reviewed code to make sure each of these are covered from the rubric
- [ x ] Your app.js file and server.js file are correctly configured, with your app.js file exporting the application created from Express. 
- [ x ] You use the cors package so that requests from the frontend can correctly reach the backend. I set this up in the app.js to allow all routes from frontend to work.  Could limit this if needed. 
- [ x ] If a request is made to a route that doesn't exist, the server returns a 404 error. 
- [ x ] If a request is made to a route that exists but the HTTP method is wrong, the server returns a 405 error. 
- [ x ] All of your routes respond with the appropriate status code and use a data key in the response.

### Deploy to Cloud
Prior to deployment, I decided to move all content from the subfolder `Final_Capstone_WeLoveMovies_Guild_Node_18_1` up to main folder.  This simplifies future deployments.

   ```bash
   : pwd
   ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1
   : mv .attachignore .env .gitignore .qualified-attach.json docs knexfile.js node_modules/ package* src test ../
   
   : git add .
   : git commit -m "Moved all files from Final_Capstone_WeLoveMovies_Guild_Node_18_1 to up to be off root of WeLoveMovies repo."
   <snip>
   
   : rmdir Final_Capstone_WeLoveMovies_Guild_Node_18_1
   ```

#### Setup Render Hosted Database
1. Setup Render DB:
   - I created a new free Render hosted DB.  Connection details are stored in the local `.env` file.  These will be used when deploying back-end app.
2. Setup `DBeaver` connection to validate credentials and to be able to validate tables and data setup.  Tested connection & saved.
3. Change to app folder:  `/Users/joe/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies/Final_Capstone_WeLoveMovies_Guild_Node_18_1`
4. Update the `.env` to set the `NODE_ENV=production` (or you can preceded all commands with `NODE_ENV=production <cmd>`)
5. Run `knex` migrations on production render hosted DB.
   ```bash
   : npx knex migrate:list
   Using environment: production
   No Completed Migration files Found.
   Found 5 Pending Migration file/files.
   20250117174804_createCriticsTable.js
   20250117174832_createMoviesTable.js
   20250117174844_createTheatersTable.js
   20250117174852_createReviewsTable.js
   20250117174906_createMovies_TheatersTable.js
   
   : npx knex migrate:latest
   Using environment: production
   Batch 1 run: 5 migrations
   ```
   - I ran `select * from <table>;` for each table to confirm created.  No data at this time.
6. Run `knex` seed to load sample data to the render hosted DB.
   ```bash
   : npx knex seed:run
   Using environment: production
   Ran 6 seed files
   ```
   - I again ran the same `select * from <table>;` for each table to confirm data existed.

#### Deploy Render Hosted Web App
1. On the Render dashboard, click on the `+New` button in top-right.  
2. Select `Web Service`
3. This should remember previously connected `https://github.com/kernel528` git organization.
4. Select the `WeLoveMovies` repository.
5. Fill out the fields:
   - Name:  `kernel528-WeLoveMovies`
   - Project:  Leave as part of current project.
   - Language:  `Node`
   - Branch: `main`
   - Region: Leave with default value.
   - Root Directory:  No change/Optional
   - Build Command:  `npm install` 
   - Start Command:  `npm start`
   - Instance Type:  Free
   - Environment Variables:  Enter values from `.env` file.
     - Name:  `PRODUCTION_DATABASE_URL`
     - Value:  `HIDDEN`
6. Click on the `Deploy Web Service` button.
7. This should take to next screen to monitor the app deployment.  
8. Open web browser to the URL for your deployed app: https://kernel528-welovemovies.onrender.com 
   - Sample routes:
     - https://kernel528-welovemovies.onrender.com/movies
     - https://kernel528-welovemovies.onrender.com/movies/5
     - https://kernel528-welovemovies.onrender.com/movies/5/theaters
     - https://kernel528-welovemovies.onrender.com/theaters

### Project rubric
For your project to pass, all of the following statements must be true. 
- [ x ] All the tests are passing in Qualified. 
- [ x ] The migrations can be correctly run and rolled back. 
- [ x ] The seed command can be run multiple times and will work correctly. 
- [ x ] A response is included for Method Not Allowed. 
- [ x ] The cors package is included. 
- [ x ] The backend application is deployed and working.

### Validations
I ran the following migrations, rollbacks, and seed/re-seed multiple times on both `dev` and `prod` deployments.
   ```bash
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud [2025-01-18 14:13:09]
   : npx knex migrate:list                                   
   Using environment: development
   Found 5 Completed Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   No Pending Migration files Found.
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:35:49] C:1 
   : npx knex seed:run
   Using environment: development
   Ran 6 seed files
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:35:53]
   : NODE_ENV=production npx knex seed:run
   Using environment: production
   Ran 6 seed files
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:36:15]
   : npx knex migrate:list
   Using environment: development
   Found 5 Completed Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   No Pending Migration files Found.
   
   : npx knex migrate:down 20250117174906_createMovies_TheatersTable.js  
   Using environment: development
   Batch 2 rolled back the following migrations:
   20250117174906_createMovies_TheatersTable.js
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:39:08]
   : npx knex migrate:list
   Using environment: development
   Found 4 Completed Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   Found 1 Pending Migration file/files.
   20250117174906_createMovies_TheatersTable.js 
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:39:14]
   : for a in 20250117174852_createReviewsTable.js 20250117174844_createTheatersTable.js 20250117174832_createMoviesTable.js 20250117174804_createCriticsTable.js                                            
   > do
   > npx knex migrate:down $a
   > done
   Using environment: development
   Batch 1 rolled back the following migrations:
   20250117174852_createReviewsTable.js
   Using environment: development
   Batch 1 rolled back the following migrations:
   20250117174844_createTheatersTable.js
   Using environment: development
   Batch 1 rolled back the following migrations:
   20250117174832_createMoviesTable.js
   Using environment: development
   Batch 1 rolled back the following migrations:
   20250117174804_createCriticsTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:39:50]
   : npx knex migrate:list
   Using environment: development
   No Completed Migration files Found. 
   Found 5 Pending Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:40:20]
   : npx knex migrate:latest
   Using environment: development
   Batch 1 run: 5 migrations
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:40:28]
   : npx knex seed:run
   Using environment: development
   Ran 6 seed files
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:40:38]
   : NODE_ENV=production npx knex migrate:list
   Using environment: production
   Found 5 Completed Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   No Pending Migration files Found.
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:41:13]
   : for a in 20250117174906_createMovies_TheatersTable.js 20250117174852_createReviewsTable.js 20250117174844_createTheatersTable.js 20250117174832_createMoviesTable.js 20250117174804_createCriticsTable.js 
   > do
   > NODE_ENV=production npx knex migrate:down $a
   > done
   Using environment: production
   Batch 1 rolled back the following migrations:
   20250117174906_createMovies_TheatersTable.js
   Using environment: production
   Batch 1 rolled back the following migrations:
   20250117174852_createReviewsTable.js
   Using environment: production
   Batch 1 rolled back the following migrations:
   20250117174844_createTheatersTable.js
   Using environment: production
   Batch 1 rolled back the following migrations:
   20250117174832_createMoviesTable.js
   Using environment: production
   Batch 1 rolled back the following migrations:
   20250117174804_createCriticsTable.js
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:41:51]
   : NODE_ENV=production npx knex migrate:list
   Using environment: production
   No Completed Migration files Found. 
   Found 5 Pending Migration file/files.
   20250117174804_createCriticsTable.js 
   20250117174832_createMoviesTable.js 
   20250117174844_createTheatersTable.js 
   20250117174852_createReviewsTable.js 
   20250117174906_createMovies_TheatersTable.js 
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:41:57]
   : NODE_ENV=production npx knex migrate:latest
   Using environment: production
   Batch 1 run: 5 migrations
   
   # joe @ obiwan in ~/github/kernel528/Chegg-Skills/Projects/Backend-Web-Dev/WeLoveMovies on git:deploy-to-cloud x [2025-01-18 14:42:50]
   : NODE_ENV=production npx knex seed:run
   Using environment: production
   Ran 6 seed files
   
   ```

#### Local Development Support
- Updated `knexfile.js` to include a local development using docker.
- To run with local development, perform the following steps.  
- Setup local data persistence, set a docker volume and map that to the docker container. 
  ```bash
  docker volume create postgres-obiwan-data
  ```
- Update the `.env` file and set the `NODE_ENV=development`
  ```bash
  docker container run -it --name postgres-obiwan --hostname postgres-obiwan --restart=always -e POSTGRES_PASSWORD=<some password> -p 5432:5432 -v postgres-obiwan-data:/var/lib/postgresql/data -d kernel528/postgres:18
  ```
- Start the backend...
  ```bash
  npm run start:dev
  ```
- Start the front-end...
  ```bash
  cd <path to front-end>
  npm run start-legacy
  ```
- Do the usual stuff with `knex` integration to setup the DB, tables, and seed data - refer to #validations section above for example.
