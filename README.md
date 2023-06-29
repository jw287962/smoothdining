# smoothdining

# API Requests

## LOGIN

### Post Methods:

<ul>post: {host}/api/register</ul>
<li>- (body.username and password requried)</li>

### Get Methods

<ul>get: {host}/api/login</ul>
<li>- (body.username and password requried)</li>

## ACCOUNT HANDLING

### Post Methods:

<ul>{host}/api/account/store</ul>
<li>- To create a new store under your account</li>

<!-- ## Create Store/Restaurant -->

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
