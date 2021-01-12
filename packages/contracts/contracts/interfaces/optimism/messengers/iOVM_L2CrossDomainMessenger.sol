// SPDX-License-Identifier: MIT
// +build ovm
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

/* Interface Imports */
import { iOVM_BaseCrossDomainMessenger } from "./iOVM_BaseCrossDomainMessenger.sol";

/**
 * @title iOVM_L2CrossDomainMessenger
 */
interface iOVM_L2CrossDomainMessenger is iOVM_BaseCrossDomainMessenger {}