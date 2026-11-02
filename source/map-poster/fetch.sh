#!/bin/bash
# usage: fetch.sh query out
q=$1; out=$2; w=10
for i in 1 2 3 4 5 6 7 8; do
 for u in https://overpass-api.de/api/interpreter https://maps.mail.ru/osm/tools/overpass/api/interpreter https://overpass.private.coffee/api/interpreter; do
  curl -s -m 150 -A "sambuca-map/1.0 (personal print)" --data-urlencode data@$q $u -o $out.tmp
  if head -c 20 $out.tmp | grep -q '{'; then mv $out.tmp $out; echo "OK $u $(stat -c %s $out)"; exit 0; fi
  echo "fail $u: $(head -c 120 $out.tmp | tr '\n' ' ')"
 done; sleep $w; w=$((w*2))
done
