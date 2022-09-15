#!/usr/bin/env bash
join() {
    local r="$(curl -s \
        -X GET \
        -o /dev/null \
        -w " %{http_code}\n" \
        https://api.kattah.me/c/xqc)"
    echo "$1: $r"
}

for i in {0..100}; do
    { join $i & } 3>&2 2>/dev/null
done
wait
