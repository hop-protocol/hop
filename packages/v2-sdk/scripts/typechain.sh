# Run:
# npm i -g typechain @typechain/ethers-v5
# cd scripts/
# ./typechain.sh

typechain --target=ethers-v5 --out-dir=../src/contracts ../abi/RailsGateway.json
