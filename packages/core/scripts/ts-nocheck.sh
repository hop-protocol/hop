for f in ./src/contracts/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/static/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/static/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

mkdir -p ./contracts/
cp ./src/contracts/*.ts ./contracts/

mkdir -p ./contracts/factories
cp ./src/contracts/factories/*.ts ./contracts/factories

mkdir -p ./contracts/factories/generated
cp ./src/contracts/factories/generated/*.ts ./contracts/factories/generated

mkdir -p ./contracts/factories/static
cp ./src/contracts/factories/static/*.ts ./contracts/factories/static

mkdir -p ./contracts/generated
cp ./src/contracts/generated/*.ts ./contracts/generated

mkdir -p ./contracts/static
cp ./src/contracts/static/*.ts ./contracts/static
