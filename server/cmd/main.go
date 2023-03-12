package main

import (
	"log"

	"github.com/sing3demons/server/db"
	"github.com/sing3demons/server/internal/user"
	"github.com/sing3demons/server/internal/ws"
	"github.com/sing3demons/server/router"
)

func main() {
	db, err := db.NewDatabase()
	if err != nil {
		panic(err)
	}

	err = db.Migrate()
	if err != nil {
		log.Fatal("can't create table", err)
		db.DropTable()
	}

	if err := db.GetDB().Ping(); err != nil {
		log.Fatal("can't connect to database", err)
	}

	log.Println("Database connected")

	defer db.Close()

	uRepo := user.NewRepository(db.GetDB())
	uService := user.NewService(uRepo)
	userHandler := user.NewHandler(uService)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()

	router.InitRouter(userHandler, wsHandler)
	router.Start(":8080")
}
