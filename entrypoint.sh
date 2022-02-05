#!/bin/sh -l
echo "Hello $1, I'm flutter sortify."
# chmod +rwx /github/home/
echo "running flutter pub get"
sudo flutter pub get
echo "sorting flutter imports"
sudo flutter pub run import_sorter:main -e
