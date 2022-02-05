#!/bin/sh -l
echo "Hello $1, I'm flutter sortify."
echo "running flutter pub get"
flutter pub get
echo "sorting flutter imports"
flutter pub run import_sorter:main -e
