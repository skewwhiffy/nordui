#!/bin/sh
cd terminal
rm -f ./lastArguments.test.txt
for i in $*
do
  echo $i >> ./lastArguments.test.txt
done

if [ -f ./nextResponse.test.txt ]; then
  cat ./nextResponse.test.txt
  exit 0
fi
echo No file
exit 1
