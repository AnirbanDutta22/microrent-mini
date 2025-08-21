This folder contains the Listings feature: entity, DTOs, service and controller.

How to use:

1. Import ListingModule into AppModule of the catalog service.
2. Ensure TypeOrmModule is configured to connect to the catalog Postgres and include entities.
3. Start the app and use the endpoints:

- POST /listings -> create listing
- GET /listings -> search listings
- GET /listings/:id -> get detail
- PATCH /listings/:id -> update
- POST /listings/:id/activate -> activate listing

Notes:

- The service uses a simple in-memory cache provider registered as 'CACHE'. Redis provider for production.
- calculatePrice performs a naive days \* price-per-day calculation; extend for discounts/taxes.
