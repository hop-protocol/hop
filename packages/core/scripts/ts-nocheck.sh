for f in ./src/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

mkdir -p ./contracts/
cp ./src/contracts/*.d.ts ./contracts/
