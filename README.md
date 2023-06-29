# smoothdining

# DATA MODELS USING NOSQL (MONGODB) (V1)

## User

```js
  signUpDate: { type: Date, required: true },
  // title: { type: String },
  google: {
    id: { type: String },
    name: { type: String },
    email: { type: String },
  },
  username: { type: String, required: true },
  password: { type: String, required: true }, //hashed
  salt: { type: String, required: true },
  store: [{ type: Schema.Types.ObjectId, ref: "Store" }],
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
  // section: { type: Number },
  // workers: [{ type: Schema.Types.ObjectId, ref: "Waiters" }],
  // shifts: [{ type: Schema.Types.ObjectId, ref: "Shift" }],
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
  // store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  // dailyData: { type: Schema.Types.ObjectId, ref: "DailyData" },
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
