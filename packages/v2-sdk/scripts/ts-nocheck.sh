for f in ./src/config/contracts/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/config/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/config/contracts/factories/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/config/contracts/factories/non_generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/config/contracts/generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/config/contracts/non_generated/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done
