#!/usr/bin/env bash

cd `dirname $0`
cd ..

projectdir=`pwd`
vmdir=/var/htmlpatch

command='bash'

if [[ "$@"  != '' ]]; then
  command="$@"
fi

docker run \
  --env SAUCE_USERNAME=$SAUCE_USERNAME \
  --env SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY \
  --rm \
  -w $vmdir \
  -v $projectdir:$vmdir:rw \
  -i \
  -t \
  soconnor/htmlpatch \
  bash -c "$command"
