for f in ./src/contracts/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

for f in ./src/contracts/factories/*.ts; do echo "// @ts-nocheck
$(cat "$f")" > "$f"; done

# for f in ./src/contracts/factories/json/*.ts; do echo "// @ts-nocheck
# $(cat "$f")" > "$f"; done

# for f in ./src/contracts/json/*.ts; do echo "// @ts-nocheck
# $(cat "$f")" > "$f"; done
