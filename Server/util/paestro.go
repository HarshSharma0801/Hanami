package util

import (
	"time"

	"github.com/o1egl/paseto"
)


type PasetoMaker struct {
	paseto *paseto.V2
	symmetricKey []byte
}


func NewPasetoMaker(symmetricKey string) (Maker , error){
	maker := &PasetoMaker{
		paseto: paseto.NewV2(),
		symmetricKey: []byte(symmetricKey),
	}

	return maker , nil
}


func(maker *PasetoMaker) CreateToken(username string , duration time.Duration , email string) (string , *Payload , error) {
  payload , err := NewPayload(username , duration , email)
  if err != nil {
	return "" , payload , err
}

token , err := maker.paseto.Encrypt(maker.symmetricKey , payload , nil)
return token , payload ,err

}

func(maker *PasetoMaker) VerifyToken(token string) (*Payload , error) {
   payload := &Payload{}

   err := maker.paseto.Decrypt(token , maker.symmetricKey , payload , nil)
   if err != nil {
	return nil , err
   }

   return payload , nil
}