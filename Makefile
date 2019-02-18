.DEFAULT_GOAL := help
TOP_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ENV=dev

up:
	docker-compose -f docker-compose.$(ENV).yml up -d

up-dev: ENV=dev
up-dev: up

up-prod: ENV=prod
up-prod: up
