import os from 'node:os'

const CONFIG_DIR = `${os.homedir()}/.hop`
export const DEFAULT_CONFIG_PATH = `${CONFIG_DIR}/default-config.json`
export const USER_CONFIG_PATH = `${CONFIG_DIR}/config.json`
