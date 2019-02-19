.DEFAULT_GOAL := help
TOP_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ENV=dev

up:
	docker-compose -f docker-compose.$(ENV).yml up -d

start:
	docker-compose -f docker-compose.$(ENV).yml start

stop:
	docker-compose -f docker-compose.$(ENV).yml stop

stop-dev: ENV=dev
stop-dev: stop

start-dev: ENV=dev
start-dev: start

up-dev: ENV=dev
up-dev: up

up-prod: ENV=prod
up-prod: up
