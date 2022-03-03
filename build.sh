# build calc-engine
cd calc-engine
./build.sh
cp -r pkg ../client/worker-src/calc-engine-pkg
cd ..

# build worker-src
cd client/worker-src
cd calc-engine-pkg
rm -f .gitignore
cd ..


