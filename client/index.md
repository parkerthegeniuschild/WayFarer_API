FORMAT: 1A
HOST: https://parkerthegeniuschild.herokuapp.com/

# WayFarer API

WayFarer is a public bus transportation booking server. Users can register, login,
and create a booking. The admins will be in charge of adding all the buses, and 
creating the trips.

This API is work in progress and if you will like to see a feature, you can [Send A Feature Request](mailto:parkerthegeniuschild@gmail.com).
This page is updated frequently, so please check back for your favourite feature.


### Create New User

```POST /auth/signup```

+ Request (x-www-form-urlencoded) 

    + Body

            {
                "email": "parkerthegeniuschild@gmail.com",
                "password": "P@ssw0rd",
                "first_name": "Mitchell",
                "last_name": "Patrick"
            }

+ Response 201 (application/json)

    + Body

            {
                "status": "success",
                "data": {
                    "user_id": 1,
                    "first_name": "Mitchell",
                    "last_name": "Patrick",
                    "email": "parkerthegeniuschild@gmail.com",
                    "is_admin": false,
                    "created_on": "2019-07-15T21:01:38.052Z",
                    "modified_on": null,
                    "token": "eyJhbGciOiJIUzI137373737363kpXVCJ9.eyJ1c2VyX2lkIjozLCJpc19hZG1pbiI6ZmFsc2UsImZpcnN0X25hbWUiOiJQYXJrZXIiLCJsYXN0X25hbWUiOiJDaGlsZCIsImVtYWlsIjoicGFya2VyQGdtYWlsLmNvbSIsImlhdCI6MTU2MzIyMjE4N30.Qam0l0LZKQqv9RJBxoUppeR9zlp3Dlmoe8NFsLtfv2o",
                }
            }

### Login A User

``` POST /auth/signin```

+ Request (x-www-form-urlencoded)

    + Body

            {
                "email": "parkerthegeniuschild@gmail.com",
                "password": "P@ssw0rd",
            }

+ Response 200 (application/json)

    + Body

            {
                "status": "success",
                "data": {
                    "user_id": 1,
                    "first_name": "Mitchell",
                    "last_name": "Patrick",
                    "email": "parkerthegeniuschild@gmail.com",
                    "is_admin": false,
                    "created_on": "2019-07-15T21:01:38.052Z",
                    "modified_on": null,
                    "token": "eyJhbGciOiJIUzI137373737363kpXVCJ9.eyJ1c2VyX2lkIjozLCJpc19hZG1pbiI6ZmFsc2UsImZpcnN0X25hbWUiOiJQYXJrZXIiLCJsYXN0X25hbWUiOiJDaGlsZCIsImVtYWlsIjoicGFya2VyQGdtYWlsLmNvbSIsImlhdCI6MTU2MzIyMjE4N30.Qam0l0LZKQqv9RJBxoUppeR9zlp3Dlmoe8NFsLtfv2o",
                }
            }
            

### Create A New Bus

```POST /buses```

+ Request (x-www-form-urlencoded)

    + Body

            {
                "number_plate": "FST 78 KJA",
                "manufacturer":  "Nissan"
                "model": "Roadstar",
                "year": 2008,
                "capacity": 45
            }

+ Response 201 (application/json)

    + Body 
            
            {
                "status": "success",
                "data": {
                    "id": 5,
                    "number_plate": "FST 78 KJA",
                    "model": "Roadstar",
                    "year": 2008,
                    "manufacturer": "Nissan",
                    "capacity": 45,
                    "created_on": "2019-07-15T22:23:53.547Z",
                    "modified_on": null
                }
            }

### Get All Buses

```GET /buses ```

+ Response 200 (application/json)

    + Body 
    
            {
                "status": "success",
                "data": [
                    {
                        "id": 1,
                        "number_plate": "FST 78 KJA",
                        "model": "Roadster",
                        "year": 2015,
                        "manufacturer": "Nissan",
                        "capacity": 45,
                        "created_on": "2019-07-15T21:00:32.563Z",
                        "modified_on": null
                    },
                    {
                        "id": 2,
                        "number_plate": "AGL 63 ISK",
                        "model": "Tacoma",
                        "year": 2018,
                        "manufacturer": "Toyota",
                        "capacity": 55,
                        "created_on": "2019-07-15T21:00:32.563Z",
                        "modified_on": null
                    },
                    {
                        "id": 3,
                        "number_plate": "BCD 77 AJS",
                        "model": "Lumin",
                        "year": 2012,
                        "manufacturer": "Ford",
                        "capacity": 65,
                        "created_on": "2019-07-15T21:00:32.563Z",
                        "modified_on": null
                    }
                ]
            }



### Create A New Trip

```POST /trips```

+ Request (x-www-form-urlencoded)

    + Body 
            
            {
                "bus_id": 1,
                "origin": "Lagos",
                "destination": "Kano",
                "trip_date": "2019-05-21",
                "fare": 7500.13
            }

+ Response 201 (application/json)

    + Body
    
            {
                "status": "success",
                "data": {
                    "trip_id": 5,
                    "bus_id": "1",
                    "origin": "Lagos",
                    "destination": "Port",
                    "fare": "7500.13",
                    "trip_date": "2019-05-21",
                    "status": "active"
                }
            }

### Get All Trips

```GET /trips```

+ Response 200 (application/json)

    + Body
            
            {
                "status": "success",
                "data": [
                    {
                        "trip_id": 1,
                        "bus_id": 1,
                        "origin": "Lagos",
                        "destination": "Abuja",
                        "fare": 3547.29,
                        "trip_date": "2019-07-30T00:00:00.000Z",
                        "status": "active"
                    },
                    {
                        "trip_id": 2,
                        "bus_id": 2,
                        "origin": "Abuja",
                        "destination": "Lagos",
                        "fare": 6271.19,
                        "trip_date": "2019-07-22T00:00:00.000Z",
                        "status": "active"
                    }
                ]
            }

### Cancel A Trip

```PATCH /trips/{tripId}```

+ Request (x-www-form-urlencoded)

    + Body 
        
            {
                "trip_id": 5
            }

+ Response 20

    + Body
        
            {
                "status": "success",
                "data": {
                    "message": "Trip cancelled successfully"
                }
            }



### Create A New Booking

```POST /bookings```

+ Request (x-www-form-urlencoded)

    + Body
    
            {
                "trip_id": 3,
                "user_id: 1,
                "seat_number": 11
            }
        
+ Response 201 (application/json)
    
    + Body
    
            {
                "status": "success",
                "data": {
                    "booking_id": 6,
                    "user_id": 1,
                    "trip_id": 3,
                    "bus_id": 3,
                    "trip_date": "2019-07-10T00:00:00.000Z",
                    "seat_number": 11,
                    "first_name": "Admin",
                    "last_name": "User",
                    "email": "admin@wayfarerapi.com"
                }
            }


### Get All Bookings

``` GET /bookings ```

+ Response 200 (application/json)

    + Body
    
            {
                "status": "success",
                "data": [
                    {
                        "booking_id": 1,
                        "user_id": 1,
                        "trip_id": 1,
                        "bus_id": 1,
                        "trip_date": "2019-07-30T00:00:00.000Z",
                        "seat_number": 27,
                        "first_name": "John",
                        "last_name": "Doe",
                        "email": "johndoe@gmail.com"
                    },
                    {
                        "booking_id": 2,
                        "user_id": 2,
                        "trip_id": 2,
                        "bus_id": 2,
                        "trip_date": "2019-07-22T00:00:00.000Z",
                        "seat_number": 13,
                        "first_name": "Jane",
                        "last_name": "Doe",
                        "email": "janedoe@gmail.com"
                    },
                    {
                        "booking_id": 3,
                        "user_id": 1,
                        "trip_id": 3,
                        "bus_id": 3,
                        "trip_date": "2019-07-10T00:00:00.000Z",
                        "seat_number": 8,
                        "first_name": "John",
                        "last_name": "Doe",
                        "email": "johndoe@gmail.com"
                    }
            }


### Delete A Booking

```DELETE /bookings/{booking_id}```

+ Request (x-www-form-urlencoded)

    + Body
    
            {
                "booking_id": 6,
            }

+ Response 200 (application/json)

    + Body
    
            {
                "status": "success",
                "data": {
                    "message": "Booking deleted successfully"
                }
            }






















