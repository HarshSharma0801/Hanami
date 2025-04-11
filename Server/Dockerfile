# Stage 1: Build the Go binary
FROM golang:1.23.1-alpine AS builder

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum for dependency caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 2: Create minimal runtime image
FROM alpine:3.18

# Add necessary runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create a non-root user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .
COPY app.env .

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port (default from your main.go)
EXPOSE 8080

# Run the binary
CMD ["./main"]