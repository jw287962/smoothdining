# smoothdining

# API Requests

HOSTLINK: "NONE" not deployed atm

## LOGIN/REGISTER - {hostLink}/...

<em>URL:</em> /api/register
<em>Method:</em>Post
<em>Request Body:</em>body.username and password requried

<em>URL:</em> /api/login
<em>Method:</em>get
<em>Request Body:</em>body.username and password requried
<em>Response:</em> Allow session with passport validation

## ACCOUNT HANDLING (MUST BE LOGIN) - {hostLink}/api/account

### STORE HANDLING

#### Get Stores/Restaurants under Account

<em>URL:</em> '/stores'
<em>Method:</em>Get
<em>Request Body:</em>
<em>Response:</em> Returns ALL stores under your account

#### Create a new Store/Restaurant under Account

<em>URL:</em> '/store'
<em>Method:</em>Post
<em>Request Body:</em>body.name and body.address
<em>Response:</em>

### Party Handling

#### Get a list of all parties today.

<em>URL:</em> '/party/'
<em>Method:</em>GET
<em>Response:</em> An array of party objects

#### Get party of a day, will check ReservationDate

<em>URL:</em>'party/:dateID'
<em>Method:</em>GET
<em>Response:</em> An array of party object
<em>Default: </em> Default reservationDate to today with time as 00:00:00

#### Create New Party Table of customer data

<em>URL:</em>''
<em>Method:</em>POST
<em>Response:</em> success or failure

# TESTS Using JEST

## Plan to implement full test coverage in the future.

<em>PartyController.spec.js: </em> Tests some middleware of partyController with mocking

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
