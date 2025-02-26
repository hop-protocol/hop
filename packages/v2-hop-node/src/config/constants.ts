import os from 'node:os'

const CONFIG_DIR = `${os.homedir()}/.hop`
export const USER_CONFIG_PATH = `${CONFIG_DIR}/config.json`
