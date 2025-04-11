# Stage 1: Build the Go binary
FROM golang:1.23.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum for dependency caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Verify the main file exists
RUN if [ ! -f main.go ]; then echo "Error: main.go not found in project root"; exit 1; fi

# Build the binary with verbose output
RUN CGO_ENABLED=0 GOOS=linux go build -v -a -installsuffix cgo -o server ./main.go

# Stage 2: Create minimal runtime image
FROM alpine:3.18

# Install ca-certificates and tzdata for secure connections and timezones
RUN apk add --no-cache ca-certificates tzdata

# Add non-root user for security
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/server .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port (adjust if your server uses a different port)
EXPOSE 8080

# Run the binary
CMD ["./server"]