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
