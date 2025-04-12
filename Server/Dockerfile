# Stage 1: Build the Go binary
FROM golang:1.23.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum for dependency caching
COPY go.mod go.sum ./

# Download dependencies (Viper, lib/pq, etc.)
RUN go mod download

# Copy the source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./main.go

# Stage 2: Create minimal runtime image
FROM alpine:3.18

# Install ca-certificates for secure HTTPS connections
RUN apk add --no-cache ca-certificates

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/server .

# Expose port (default, overridden by Railway's PORT env var)
EXPOSE 8080

# Run the binary
CMD ["./server"]