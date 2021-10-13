for f in ./src/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

cp ./src/contracts/*.d.ts ./contracts/
