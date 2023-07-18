# API Requests

DEPLOYED with AZURE Pipelines: https://smoothdining.azurewebsites.net/

JWT + LOCAL (WILL IMPLEMENT OAUTH FOR GOOGLE LOGIN IN THE FUTURE)

# Documentation TODO

I should make a backend route that holds documentations with pug and router in /docs

# smoothdining

- May implement a way for customers to search and ask for a reservation and requestted time, and which the owner/host would configure and confirm.
  but, for now, it would only allow hosts/owners to add party in person that the customer would call about.

# NOTES!

- Thinking of Implementing a shiftData Model to let users define and edit a AM shift PM shift or more shifts, from which a Shift will link to, or I could leave it like now, and have the Front-end determine what each number represents, and when to create a shift 0 or 1 or 2.
  If so, I may just add shiftData that takes a string like PM or a descriptive name within Shift model

## LOGIN/REGISTER

POST :pencil: : Register Account

- **URL:** /api/register
- **Method:** Post
- **Request Body:** body.username and password requried

GET: :file_folder: Login Account

- **URL:** /api/login
- **Method:** get
- **Request Body:** body.username and password requried
- **Response:** Allow session with passport validation

## ACCOUNT HANDLING (REQ: LOGIN)-

**{hostLink}/api/account**

### STORE HANDLING

GET :file_folder:: Get Stores/Restaurants under Account

- **URL:** api/account/stores
- **Method:** Get
- **Request Body:**
- **Response:** Returns ALL stores under your account

GET :file_folder:: Get Stores/Restaurants under Account

- **URL:** api/account/store/:storeID
- **Method:** Get
- **Request Body:** put storeID in param to get specific storeData
- **Response:** Returns ALL stores under your account

POST :pencil: : Create a new Store/Restaurant under Account

- **URL:** /api/account/store
- **Method:** Post
- **Request Body:** body.name and body.address
- **Response:** Success/Failure

### Party Handling

GET :file_folder:: Get a list of all parties today.

- **URL:** /api/account/store/party/
- **Method:** GET
- **Request Body:**
- **Response:** An array of party objects

GET :file_folder:: Get party of a day, will check ReservationDate

- **URL:** /api/account/store/party/:dateID
- **Method:** GET
- **Response:** An array of party object
- **Default:** Default reservationDate to today with time as 00:00:00

POST :pencil: : Create New Party Table of customer data

- **URL:** '/api/account/store/party'
- **Method:** POST
- **Response:** Success/Failure

POST :pencil: : Create New Party Table of customer data

- **URL:** '/api/account/store/party/generic'
- **Method:** POST
- **Note:** CREATE GENERIC PARTY QUICKLY (Only requires partySize)
- **Response:** Success/Failure

PUT :pencil2: : Update Party Details

- **URL:** '/api/account/store/:partyID'
- **Method:** POST
- **Response:** Success/Failure
- **Request Body:** checkInTime, startDiningTime, isEntreeOnTable

### Waiter Handling

Get :file_folder:: Get All Waiters

- **URL:** '/api/account/store/waiters'
- **Method:** GET
- **Note:** GET ALL WAITERS UNDER A STORE
- **Request Body:** req.query.status True for Active | False for inactive | & no query status param will retrieve any waiter
- **Response:** Success/Failure

POST :pencil: : ADD NEW WAITER

- **URL:** '/api/account/store/waiters'
- **Method:** POST
- **Request:**
  body("name") Optional
  body("birthdate") Optional
  cookie("storeid")
  body("maxActiveTableForPermission") Optional Number
  body("waitToSitUntilEntreeOut") Optional Number (At this number of active tables, you should ask to sit if there customres do not have food at the table yet)
- **Response:** Success/Failure

PUT :pencil2: : UPDATE WAITER DETAILS

- **URL:** '/api/account/store/waiters/:waiterID'
- **Method:** POST
- **Request:** req.body { name: string , birtdate: Date ,
  Preferences: {maxActiveTableForPermission: number waitToSitUntilEntreeOut: number}}
- **Response:** Success/Failure

### Shifts Handling

POST :pencil: : CREATE NEW SHIFT FOR WAITER

- **URL:** '/api/account/store/shifts/:waiterID`
- **Method:** POST
- **Request:** req.body { section: shiftSection, shiftNumber: shiftNumber}
- **Response:** Success/Failure error

Put :pencil2: : UPDATE Shift data with new party Tables

- **URL:** '/api/account/store/shifts/:waiterID`
- **Method:** POST
- **Request:** req.body { shiftID, partyID, partySize}

  - NOTES: I will implement C .
    1.  shiftTables will hold only 1 instance of the partyID reference. The front end will be required to correctly modify the array where, for example, every 4 people will count as an additional table in the array
        Pros: This will make it easier to update the Party collection Data, and allow for flexibility by recreating the correct data at loadtime
        Con: Front-end will have to logically create it
    2.  OR If I add multiple instances of the partyID reference in the shiftTables to represent bigger party/guest groups, so the frontend doesn't have to worry about it. But, it will be harder to manipulate the party collection data and reflect it correctly in the shiftTables
        IE: If I update the party from 9 people to 7 people.
        I would have to identify and delete the old data/ and re add it into the shiftTables with the correct # of instances.
        PRO: front-end only needs to display data.
    3.  Combine the two together. Mongodb will only store a single instance (IE: Do B first) , then rearrange the array before sending it to the host within express, so the front-end won't have to worry about how to configure the logic

- **Response:** Success/Failure error

# TESTS Using JEST

## Plan to implement full test coverage in the future.

**PartyController.spec.js: ** Tests some middleware of partyController with mocking

currently, focusing on finishign and creating a working project with manual tests w/ Postman on each new implementation of code.
But, may add tests to certain parts that may be more complex and hard to test with postman.
Plan to implement full test coverage in the future.

# DATA MODELS USING NOSQL (MONGODB) (V1)

## User

Support different user Roles, but will implement owner support first

```js
  signUpDate: { type: Date, required: true },
  google: {
    id: { type: String },
    name: { type: String },
    email: { type: String },
  },
  username: { type: String, required: true },
  hash: { type: String, required: true }, //hashed
  salt: { type: String, required: true },
  store: [{ type: Schema.Types.ObjectId, ref: "Store" }],
  role: { enum: ["Owner", "Worker", "Customer"], default: "Owner" },
```

## Store

```js
  address: { type: String },
  name: { type: String },
```

## Waiters

```js
  name: string;
  birthdate: Date;
  preferences?: {
    maxActiveTableForPermission: number,
    waitToSitUntilEntreeOut: { min: number },
  };
  store: ObjectId;
  status: Boolean;
```

## Shifts

```js
  date: {
    type: Date,
    set: ...
    get: ...
    required: true,
  },
  section: { type: Number, required: true },
  waiters: { type: Schema.Types.ObjectId, ref: "Waiters" },
  shiftNumber: { type: Number }, //for Grouping
  shiftTables: [{ type: Schema.Types.ObjectId, ref: "Party" }],
  lastPartyTaken: { type: Date },
```

## Party (Customer Party)

```js
  name: { type: String },
  partySize: { type: Number, required: true },
  phoneNumber: { type: String },
  reservationDate: { type: Date },
  reservationDateTime: { type: Date },
  timeData: {
    checkInTime: { type: Date },
    startDining: { time: { type: Date }, isEntreeOnTable: { type: Boolean } },
    finishedTime: { type: Date },
    waitingTime: { type: Date },
  },
  status: {
    type: String,
    enum: ["active", "finished", "canceled"],
    default: "active",
  },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
```
