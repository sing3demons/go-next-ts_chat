postgresInit:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -e POSTGRES_DB=go-chat -d postgres:15-alpine

postgres:
	docker exec -it postgres psql

createdb:
	docker exec -it postgres createdb -username=root --owner=root go-chat

dropdb:
	docker exec -it postgres dropdb go-chat
.PHONY: postgresInit postgres createdb dropdb