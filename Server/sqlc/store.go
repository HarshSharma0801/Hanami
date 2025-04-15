package sqlc

import "database/sql"

type Store struct {
	*Queries
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db:      db,
		Queries: New(db),
	}
}

// GetDB returns the database connection
func (store *Store) GetDB() *sql.DB {
	return store.db
}
