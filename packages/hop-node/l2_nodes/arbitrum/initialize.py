import argparse
import os
import sys
import json

NAME = "arbitrum-validators-setup"
DESCRIPTION = "Initialize validators for the given rollup chain."

def setup_validator_states(count, folder, config):
    if count < 1:
        sys.exit('must create at least 1 validator')

    dir_path = os.path.dirname(os.path.realpath(__file__))
    rollups_path = dir_path.rstrip('/') + '/data/rollups/'

    if not os.path.isdir(rollups_path):
        os.makedirs(rollups_path)

    arbOS_data = open(dir_path + '/arbos.mexe').read()
    rollup_path = rollups_path + folder + '/'
    if os.path.isdir(rollup_path):
        sys.exit(f'{rollup_path} folder already exists')

    os.makedirs(rollup_path)
    i = 0
    while i < count:
        val_path = f'{rollup_path}validator{i}/'
        os.makedirs(val_path)
        f = open(val_path + 'config.json', 'w')
        f.write(json.dumps(config))
        f.close()
        f = open(val_path + 'contract.mexe', 'w')
        f.write(arbOS_data)
        f.close()
        i+=1

def main():
    parser = argparse.ArgumentParser(prog=NAME, description=DESCRIPTION)
    parser.add_argument("rollup", help="The address of the rollup chain.")
    parser.add_argument("ethurl", help="URL for ethereum node.")
    parser.add_argument("validatorcount", type=int, default=1, nargs='?', help="number of validators to deploy")
    parser.add_argument("blocktime", type=int, default=2, nargs='?', help="Expected length of time between blocks")
    args = parser.parse_args()

    if not args.rollup or not args.ethurl:
        sys.exit('must supply rollup address and eth url')

    config = dict({
        'rollup_address': args.rollup,
        'eth_url': args.ethurl,
        'blocktime': args.blocktime
    })

    setup_validator_states(args.validatorcount + 1, args.rollup, config)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
