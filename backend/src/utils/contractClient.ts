import { ethers } from "ethers";
import path from "path";
import fs from "fs";
import { config } from "../config";

function loadAbi(contractName: string) {
  const artifactPath = path.resolve(__dirname, "../../contracts/artifacts/contracts", `${contractName}.sol`, `${contractName}.json`);
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  return artifact.abi;
}

const provider = new ethers.JsonRpcProvider(config.providerUrl);

export function getContract(name: string, address: string, signer?: ethers.Signer) {
  const abi = loadAbi(name);
  return new ethers.Contract(address, abi, signer || provider);
}

export function getSigner(privateKey: string) {
  return new ethers.Wallet(privateKey, provider);
}
