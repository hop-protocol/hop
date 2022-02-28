import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk/dist/src/sdk";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};

let sdk;

export function getSDKInstance() {
  if (!sdk) {
    sdk = new SafeAppsSDK(opts);
  }
  return sdk;
}
