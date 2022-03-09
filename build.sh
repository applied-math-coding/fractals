# build calc-engine
cd calc-engine
./build.sh
rm -rf ../client/src/calc-engine-pkg
mkdir ../client/src/calc-engine-pkg
cp -r pkg/* ../client/src/calc-engine-pkg
rm -rf ../client/public/build-wasm/*
cp pkg/*.wasm ../client/public/build-wasm
rm ../client/src/calc-engine-pkg/package.json
cd ..

# build client for github pages
cd client
rm -rf dist
npm run build:pages
cd ..
rm -rf docs
mkdir docs
cp -r client/dist/* docs

# build client
cd client
rm -rf dist
npm run build
cd ..


