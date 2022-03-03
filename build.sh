# build calc-engine
cd calc-engine
./build.sh
rm -rf ../client/src/calc-engine-pkg
mkdir ../client/src/calc-engine-pkg
cp -r pkg/* ../client/src/calc-engine-pkg
rm ../client/src/calc-engine-pkg/.gitignore
rm ../client/src/calc-engine-pkg/.package.json
cd ..

# build client
cd client
rm -rf dist
npm run build
cd ..


