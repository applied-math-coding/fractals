# build calc-engine
cd calc-engine
./build.sh
rm -rf ../client/src/calc-engine-pkg
mkdir ../client/src/calc-engine-pkg
cp -r wasm-exports/pkg/* ../client/src/calc-engine-pkg
rm -f ../client/public/wasm_exports_bg.wasm
cp ../client/src/calc-engine-pkg/wasm_exports_bg.wasm ../client/public
rm ../client/src/calc-engine-pkg/package.json
cd ..

# build client
cd client
rm -rf dist
npm run build
cd ..


