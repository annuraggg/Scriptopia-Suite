import Web3 from "web3";
import { AbiItem } from "web3-utils";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    process.env.ETHEREUM_RPC_URL ||
    "https://sepolia.infura.io/v3/5db8670c94514ff19dec306e8867bbc6"
  )
);

const adminPrivateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;

if (!adminPrivateKey || !/^0x[0-9a-fA-F]{64}$/.test(adminPrivateKey)) {
  throw new Error(
    "Invalid or missing ADMIN_WALLET_PRIVATE_KEY in environment variables. " +
    'It must be a 64-character hexadecimal string starting with "0x".'
  );
}

const adminWallet = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);
web3.eth.accounts.wallet.add(adminWallet);

const ScryptoTokenABI: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
if (!tokenContractAddress) {
  throw new Error("Missing TOKEN_CONTRACT_ADDRESS in environment variables.");
}

const tokenContract = new web3.eth.Contract(
  ScryptoTokenABI,
  tokenContractAddress
);

const getRewardChance = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return 0.5;
    case "medium":
      return 0.35;
    case "hard":
      return 0.2;
    default:
      return 0;
  }
};

const shouldRewardUser = (difficulty: string): boolean => {
  const chance = getRewardChance(difficulty);
  return Math.random() < chance;
};

const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const balance = await tokenContract.methods.balanceOf(address).call();
    if (balance) {
      return web3.utils.fromWei(balance.toString(), "ether");
    } else {
      return "0";
    }
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};

const sendTokenReward = async (
  toAddress: string,
  amount: string
): Promise<boolean> => {
  try {
    const amountInWei = web3.utils.toWei(amount, "ether");

    const gasPrice = await web3.eth.getGasPrice();
    const gas = await tokenContract.methods
      .transfer(toAddress, amountInWei)
      .estimateGas({ from: adminWallet.address })
      .catch((error) => {
        console.error('Gas estimation failed:', error);
        return 500000;
      });

    const receipt = await tokenContract.methods
      .transfer(toAddress, amountInWei)
      .send({
        from: adminWallet.address,
        gas: gas.toString(),
        gasPrice: gasPrice.toString(),
      });

    console.log(
      `Tokens sent to ${toAddress}. Transaction hash: ${receipt.transactionHash}`
    );
    return true;
  } catch (error) {
    console.error("Error sending token reward:", error);
    return false;
  }
};

const createWallet = (): { address: string; privateKey: string } => {
  const account = web3.eth.accounts.create();
  return {
    address: account.address,
    privateKey: account.privateKey,
  };
};

export {
  shouldRewardUser,
  getRewardChance,
  getTokenBalance,
  sendTokenReward,
  createWallet,
};
