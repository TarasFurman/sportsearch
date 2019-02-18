#!/usr/bin/env bash

uwsgi -s /tmp/backend.sock --manage-script-name --mount /api=myapp:app
