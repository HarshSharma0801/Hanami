package main

import (
	"Hanami/api"
	"Hanami/sqlc"
	"Hanami/util"
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func main() {

	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatalf("could not able to initialize env : %v", err)
	}

	conn, err := sql.Open("postgres", config.DbUrl)
	if err != nil {
		log.Fatalf("could not able to connect to database : %v", err)
	}

	store := sqlc.NewStore(conn)

	server, err := api.NewServer(store, config)
	if err != nil {
		log.Fatalf("could not able to initialize server  : %v", err)
	}

	if err := server.Init(config.Port); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}

}
