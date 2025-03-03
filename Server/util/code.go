package util

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func Generate_Code() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()+100000), nil
}
