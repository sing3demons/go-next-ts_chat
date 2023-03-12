package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	db *sql.DB
}

func NewDatabase() (*Database, error) {
	db, err := sql.Open("postgres", "postgres://root:password@localhost:5432/go-chat?sslmode=disable&timezone=Asia/Bangkok")
	if err != nil {
		return nil, err
	}

	return &Database{db}, nil
}

func (d *Database) Migrate() error {
	createTb := `
	CREATE TABLE IF NOT EXISTS "users" (
    "id" bigserial PRIMARY KEY,
    "username" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL
	);
	`

	_, err := d.db.Exec(createTb)
	return err
}

func (d *Database) DropTable() (sql.Result, error) {
	return d.db.Exec(`DROP TABLE IF EXISTS users;`)
}

func (d *Database) Close() error {
	return d.db.Close()
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}
