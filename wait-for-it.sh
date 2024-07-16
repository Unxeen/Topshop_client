#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for MySQL at $host:$port..."
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
