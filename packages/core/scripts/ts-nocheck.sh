for f in ./src/contracts/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/non_generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/non_generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done
