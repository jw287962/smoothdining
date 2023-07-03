# smoothdining

- May implement a way for customers to search and ask for a reservation and requestted time, and which the owner/host would configure and confirm.
  but, for now, it would only allow hosts/owners to add party in person that the customer would call about.

# NOTES!

SENDING DATE DATA: Dates will and should be stored as : 2023-06-30T00:00:00.000+00:00
Thus, query data of dates should be sent in the same format.

- Thinking of Implementing a shiftData Model to let users define and edit a AM shift PM shift or more shifts, from which a Shift will link to, or I could leave it like now, and have the Front-end determine what each number represents, and when to create a shift 0 or 1 or 2.
  If so, I may just add shiftData that takes a string like PM or a descriptive name within Shift model

# API Requests

HOSTLINK: "NONE" not deployed atm

## LOGIN/REGISTER

**{hostLink}/...**

POST: Register Account

- **URL:** /api/register
- **Method:** Post
- **Request Body:** body.username and password requried

GET: Login Account

- **URL:** /api/login
- **Method:** get
- **Request Body:**body.username and password requried
- **Response:** Allow session with passport validation

## ACCOUNT HANDLING (REQ: LOGIN)-

**{hostLink}/api/account**

### STORE HANDLING

GET: Get Stores/Restaurants under Account

- **URL:** api/stores
- **Method:** Get
- **Request Body:**
- **Response:** Returns ALL stores under your account

POST : Create a new Store/Restaurant under Account

- **URL:** /api/store
- **Method:** Post
- **Request Body:** body.name and body.address
- **Response:**

### Party Handling

GET: Get a list of all parties today.

- **URL:** /api/party/
- **Method:** GET
- **Response:** An array of party objects

GET: Get party of a day, will check ReservationDate

- **URL:** /api/party/:dateID
- **Method:** GET
- **Response:** An array of party object
- **Default:** Default reservationDate to today with time as 00:00:00

POST: Create New Party Table of customer data

- **URL:** '/api/party'
- **Method:** POST
- **Response:** success or failure

PUT: Update Party Details

- **URL:** '/api/:partyID'
- **Method:** POST
- **Response:** success or failure

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
  name: { type: String, required: true },
  birthdate: { type: Date },
  preferences: {
    maxActiveTableForPermission: { type: Number },
    waitToSitUntilEntreeOut: { min: { type: Number } },
  },
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
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
  phoneNumber: { type: Number, required: true },
  reservationDate: { type: Date },
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
