#!/bin/bash

pkill -9 python3
pkill -9 daphne

uv run daphne config.asgi:application &
