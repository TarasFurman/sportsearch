.DEFAULT_GOAL := help
TOP_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ENV=dev

up:
	docker-compose -f docker-compose.$(ENV).yml up -d;
	docker-compose -f docker-compose.$(ENV).yml  exec backend  python src/api/fill_data.py test

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
