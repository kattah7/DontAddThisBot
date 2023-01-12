#!/usr/bin/env bash
join() {
    local r="$(curl -s \
        -X POST \
        -o /dev/null \
        -w " %{http_code}\n" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzNzE5OTYyNiIsImxvZ2luIjoia2F0dGFoIiwiaWF0IjoxNjczMjI4NTAwfQ.8uh_0uFnuX1j-zCQdYhwKxl7m1WW2-X0Ap38eMgwV3M" \
        https://api.poros.lol/api/bot/join)"
    echo "$1: $r"
}

for i in {0..20}; do
    { join $i & } 3>&2 2>/dev/null
done
wait