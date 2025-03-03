package util

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Payload struct {
	ID       uuid.UUID `json:"id,omitempty"`
	Username string    `json:"username,omitempty"`
	Email string    `json:"email,omitempty"`
	IssuedAt  time.Time `json:"issued_at,omitempty"`
	ExpiredAt time.Time `json:"expired_at,omitempty"`
	jwt.RegisteredClaims
}

func NewPayload(username string, duration time.Duration, email string) (*Payload, error) {
	tokenId, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}

	payload := &Payload{
		Username:  username,
		Email:     email,
		ID:        tokenId,
		IssuedAt:  time.Now(),
		ExpiredAt: time.Now().Add(duration),
	}

	return payload, nil
}
