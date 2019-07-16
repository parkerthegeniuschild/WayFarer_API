[![Build Status](https://travis-ci.org/parkerthegeniuschild/WayFarer_API.svg?branch=develop)](https://travis-ci.org/parkerthegeniuschild/WayFarer_API)
[![Coverage Status](https://coveralls.io/repos/github/parkerthegeniuschild/WayFarer_API/badge.svg?branch=develop)](https://coveralls.io/github/parkerthegeniuschild/WayFarer_API?branch=develop)
[![License Badge](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/badge/contributors-1-orange.svg?style=flat-square)]()


  <h1 align="center"> :vertical_traffic_light: :oncoming_bus: WayFarer_API :minibus: :busstop: </h1>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project


This project contains the API that powers the server used for a bus transportation booking service. It allows users to create an account, login, check for available trips and make a booking. Admin accounts can also be created to create the buses used for the trips and manage the server as a whole. You will need to have a front to consume this API.

### Built With

* [Node js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org)


<!-- GETTING STARTED -->
## Getting Started

To successfully use this repository, please follow the guide below.

### Prerequisites

You should have a working installation of node, npm and PostgreSQL prior to cloning this project.


* To verify the installation your node installation, run the command:
```sh
$ nodejs --version
```
```
Output
# Subject to version installed

v10.15.3
```
* To be able to download npm packages, you also need to install npm, the Node.js package manager.
Verify the npm by typing:

```sh
$ npm --version
```
```
Output:
# Subject to version installed

6.10.0
```
* Verify the PostgreSQL version with any of the commands
```sh
$ psql --version
$ postgres --version
```
```
Output:
# Subject to version installed

postgres (PostgreSQL) 9.6.1
```

### Installation

* Clone the repo
```sh
git clone https://github.com/parkerthegeniuschild/WayFarer_API.git
```
* Install NPM packages
```sh
npm install
```
*  cd into the project folder
```sh
cd WayFarer_API
```
* You wll find an `env.example` file in the root directory of the project. Rename this file to `.env` and `add your own environment variables and secretKeys`. This file will now look something like this:

```JS
NODE_ENV=development
PORT=3000

PGHOST=localhost
PGPORT=5432
PGUSER=postgres_user
PGPASSWORD=postgres_passwd
PGNAME=myawesome_db

JWT_SECRET=mySup3rHardS3cr3tk3y

ADMIN_SECRET_CODE=sup3rHardAdm1nC0d3
```
* You can create a ready to go version by running
```sh
$ npm run migrate
```
* The details of the migration are contained in the `src/db/migration.db.js` file. It contains the mock data that would be generated using `npm run migrate` command.

* Bob's your Uncle, at this stage you're a :rocket: :rocket: :rocket:

* You can start the server in `development` mode with `npm run start:dev`

* In `production` mode, please run a build with `npm run build`and  then start the server with `npm start`


<!-- USAGE EXAMPLES -->
## Usage

This project makes use of versioning; so you will need to make sure your are calling the endpoints correctly like this:
```
https://myawesomeapi.com/api/v1/user/signup
```

Citing the example above, making a `POST` request to that endpoint with the request body:
```
# Request Body:
	"email": "parkerthegeniuschild@gmail.com",
	"password": "P@ssw0rd",
	"first_name": "Mitchell",
	"last_name": "Patrick"
```
will return an `application/json` response like so:
```
# Response Body (201):
      "status": "success",
      "data": {
          "user_id": 1,
          "first_name": "Mitchell",
          "last_name": "Patrick",
          "email": "parkerthegeniuschild@gmail.com",
          "is_admin": false,
          "created_on": "2019-07-15T21:01:38.052Z",
          "modified_on": null,
          "token": "eyJhbGciOiJIFya2VyQGdtYWlsLMjE4N30.Qam0l0LZKQqv9RJBxoUppeR9zlp3Dlmoe8NFsLtfv2o",
	      }
	  }

```
As you can see a `token` is returned as part of the result. The token is set to expire after `1 hour` and will be regenerated on the next successful login. You will need this token to make calls to `protected` endpoints.

An example of one such calls is cited below.
```
POST /trips

# CREATE A NEW TRIP
# This endpoint is protected and requires the token. Afterwhich the token will be 
decoded to verify if the requester has admin privileges.

# Request Headers:
Content-Type: "application/x-www-form-urlencoded"
Authorization: "Bearer eyJhbGciOiJIIkpXVCJ9.eyOiJEb2UiLCJlbW9tIiwiaWF0IjoxNTYzM"

# Request Body:
	"bus_id": 1,
	"origin": "Lagos",
	"destination": "Kano",
	"trip_date": "2019-05-21",
	"fare": 7500.13

# Response Body (201):
      "status": "success",
      "data": {
		  "trip_id": 5,
		  "bus_id": "1",
		  "origin": "Lagos",
		  "destination": "Kano",
		  "fare": "7500.13",
		  "trip_date": "2019-05-21",
		  "status": "active"
      }
 
# Response Body (No token) 403
 	{
	    "status": "error",
	    "error": "You must be logged in to proceed"
	}
	
# Response Body (No Admin Privilege) 401
	{
	    "status": "error",
	    "error": "Auth Error: Only Admins can perform this operation"
	}
# Response Body (Wrong/Expired Token) 400
	{
	    "status": "error",
	    "error": "Authentication failed!"
	}
```

_For more examples, please refer to the [Documentation](https://parkerthegeniuschild.herokuapp.com/api/v1)_ hosted on Heroku.


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions (including :bug: :bug: reports)  you make are **greatly appreciated**.

```
* Fork the Project
* Create your feature branch (`git checkout -b feature/anAwesomeFeature`)
* Commit your changes (`git commit -m 'Added an anAwesomeFeature'`)
* Push to the branch (`git push origin feature/anAwesomeFeature`)
* Open a Pull Request
```

## Contact

MITCHELL PATRICK  - parkerthegeniuschild@gmail.com

Project Link: [https://parkerthegeniuschild.herokuapp.com/api/v1](https://parkerthegeniuschild.herokuapp.com/api/v1)


## License
```
Tuesday, 16. July 2019 09:37PM 
MIT License

Copyright (c) [2019] MITCHELL PATRICK]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the 
Software isfurnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in allcopies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF 
OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```



