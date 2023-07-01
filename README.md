# smoothdining

# API Requests

HOSTLINK: "NONE" not deployed atm

## LOGIN/REGISTER

**{hostLink}/...**
Register Account

<ul>
<li>**URL:**  /api/register</li>
<li>**Method:** Post</li>
<li>**Request Body:** body.username and password requried</li>
</ul>

Login Account
**URL:** /api/login
**Method:** get
**Request Body:**body.username and password requried
**Response:** Allow session with passport validation

## ACCOUNT HANDLING (REQ: LOGIN)-

**{hostLink}/api/account**

### STORE HANDLING

#### Get Stores/Restaurants under Account

**URL:** '/stores'
**Method:** Get
**Request Body:**
**Response:** Returns ALL stores under your account

#### Create a new Store/Restaurant under Account

**URL:** '/store'
**Method:**Post
**Request Body:**body.name and body.address
**Response:**

### Party Handling

#### Get a list of all parties today.

**URL:** '/party/'
**Method:**GET
**Response:** An array of party objects

#### Get party of a day, will check ReservationDate

**URL:**'party/:dateID'
**Method:**GET
**Response:** An array of party object
**Default: ** Default reservationDate to today with time as 00:00:00

#### Create New Party Table of customer data

**URL:**''
**Method:**POST
**Response:** success or failure

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
