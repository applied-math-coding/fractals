cd wasm-exports
rm -rf pkg
rm -rf target
wasm-pack build --target web
cd ..