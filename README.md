
# Reservify

Reservify is a full-stack reservation platform for accommodations and restaurants.  
Users can browse listings, make bookings, manage their reservations, and process payments through Razorpay.

## Project Owner

Aviral Shukla

## Repository

https://github.com/getchaviral/smart-reservation-system

## Demo

https://smart-reservation-system-md2oehly0-getchavirals-projects.vercel.app/

## Video

Will be added soon.

## Screenshots

![Home](https://github.com/user-attachments/assets/1a4eeebe-dbb6-4954-b6e5-855921c3a7b1)
![Listings](https://github.com/user-attachments/assets/075f34e1-e61f-43bf-a6a9-1ffca0fa8c81)
![Reserve Details](https://github.com/user-attachments/assets/01807537-da7c-4570-8053-988cac52a24c)
![Account and Dashboard](https://github.com/user-attachments/assets/f98ac679-28de-4994-90d7-d4b251618d6b)

## Key Features

1. Booking functionality for accommodations and restaurants
2. Interactive frontend with filtering and reserve pages
3. User account area for reserve and booking management
4. Razorpay payment integration
5. CRUD operations for reserve management
6. Cloudinary-based image storage support
7. Razorpay transaction tracking with verification status

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Media: Cloudinary
- Payments: Razorpay

## Installation

```bash
git clone https://github.com/getchaviral/smart-reservation-system.git
cd smart-reservation-system
```

### Server setup

```bash
cd Server
npm install
npm run dev
```

### Client setup

```bash
cd Client
npm install
npm run dev
```

## Environment Variables

Create `.env` files for both server and client.

Server (`Server/.env`):

- `Mongo_ConnectionString`
- `ACCESS`
- `REFRESH`
- `Cloudinary_Name`
- `Cloudinary_APIKEY`
- `Cloudinary_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FRONTEND_API_URL`
- `USD_TO_INR_RATE` (optional, default: `83`)
- `NODE_ENV` (`development` or `production`)

Client (`Client/.env`):

- `VITE_API_URL` (example: `http://localhost:3000` for local development)

## Payment Tracking (Razorpay)

- `POST /Payment`: Creates a Razorpay order and stores a `PaymentTransaction` with status `created`
- `POST /Payment/verify`: Verifies signature and updates status to `paid` or `failed`
- `GET /Payment/status/:id`: Returns stored transaction status

## Health Checks

- `GET /health`: Liveness endpoint
- `GET /ready`: Readiness endpoint (checks MongoDB connection)

## Testing

Backend tests are set up with `Vitest`, `Supertest`, and `mongodb-memory-server`.

Run tests from `Server`:

```bash
npm install
npm test
```

Current coverage includes:

- Unit test for booking conflict input validation
- Integration tests for `/health` and `/ready`
- Integration test for payment conflict prevention on `/Payment`

## Seed Data

Seed demo reserves for local development:

```bash
cd Server
npm run seed:dev
```

For production-style seeding:

```bash
cd Server
npm run seed:prod
```

`seed:prod` is idempotent (upsert), so reruns update matching records instead of creating duplicates.

## Live Deployment Notes

1. Do not auto-seed on server startup in production
2. Set `NODE_ENV=production` on the server
3. Use production MongoDB Atlas credentials in `Mongo_ConnectionString`
4. Set `FRONTEND_API_URL` to your deployed frontend domain
5. Set `VITE_API_URL` to your deployed backend domain
6. Add real listings via admin/UI or production seed data

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss the proposal.

## License

[MIT](https://choosealicense.com/licenses/mit/)


 
