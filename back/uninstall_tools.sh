#!/bin/bash

echo "Running $0"

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    gitbucket)
    echo "Uninstalling gitbucket"
    helm delete --purge gitbucket
    shift
    ;;
    *)
    shift
    ;;
esac
done

