.PHONY: postgresinit createdb dropdb migrateMake migrateup migrateup1 migratedown migratedown1 sqlc server

# Initialize PostgreSQL container
postgresinit:
	docker run --name postgres15 -p 5422:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:15-alpine

# Create the database inside the container
createdb:
	docker exec -it postgres15 createdb --username=root --owner=root promotopia

# Drop the database inside the container
dropdb:
	docker exec -it postgres15 dropdb promotopia

# Create a new migration file
migrateMake:
	migrate create -ext sql -dir db/migration -seq init

# Apply all migrations
migrateup:
	migrate -path db/migration -database "postgresql://root:password@localhost:5422/promotopia?sslmode=disable" -verbose up

# Apply only one migration step
migrateup1:
	migrate -path db/migration -database "postgresql://root:password@localhost:5422/promotopia?sslmode=disable" -verbose up 1

# Roll back all migrations
migratedown:
	migrate -path db/migration -database "postgresql://root:password@localhost:5422/promotopia?sslmode=disable" -verbose down

# Roll back only one migration step
migratedown1:
	migrate -path db/migration -database "postgresql://root:password@localhost:5422/promotopia?sslmode=disable" -verbose down 1

# Generate SQL code using sqlc
sqlc:
	sqlc generate

# Start the Go server
server:
	go run main.go
