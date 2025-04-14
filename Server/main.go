package main

import (
	"Hanami/api"
	"Hanami/sqlc"
	"Hanami/util"
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {

	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatalf("could not able to initialize env : %v", err)
	}

	conn, err := sql.Open(os.Getenv("DRIVER"), os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("could not able to connect to database : %v", err)
	}

	log.Printf("connected to DB %v", os.Getenv("DB_URL"))

	store := sqlc.NewStore(conn)

	server, err := api.NewServer(store, config)
	if err != nil {
		log.Fatalf("could not able to initialize server  : %v", err)
	}

	if err := server.Init("0.0.0.0:2050"); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}

}
