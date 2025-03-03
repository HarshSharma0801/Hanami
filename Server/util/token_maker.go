package util

import (
	"errors"
	"time"
	"github.com/golang-jwt/jwt/v5"
)




type Maker interface {

	CreateToken(username string,  duration time.Duration , email string) (string,  *Payload , error) 
	VerifyToken(token string) (*Payload , error) 

}

type TokenMaker struct {
	secretKey string
}

func NewTokenMaker(secretKey string) (Maker, error) {

	return &TokenMaker{
		secretKey: secretKey,
	}, nil

}

func (maker *TokenMaker) CreateToken(username string, duration time.Duration , email string) (string, *Payload, error) {

	payload, err := NewPayload(username, duration , email)
	if err != nil {
		return "", payload, err
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	token, err := jwtToken.SignedString([]byte(maker.secretKey))

	return token, payload, err
}

func (maker *TokenMaker) VerifyToken(token string) (*Payload, error) {

	keyFunc := func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, errors.New("token invalid")
		}
		return []byte(maker.secretKey), nil
	}
	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, keyFunc)

	if err != nil {
		return nil, errors.New("invalid token")
	}

	payload, ok := jwtToken.Claims.(*Payload)
	if !ok {
		return nil, errors.New("token invalid")
	}

	return payload, nil

}
