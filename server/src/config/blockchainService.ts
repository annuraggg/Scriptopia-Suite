import { User } from "@shared-types/User";
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
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "   ",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
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
      return 0.9;
    case "medium":
      return 0.9;
    case "hard":
      return 0.9;
    default:
      return 0;
  }
};

const shouldRewardUser = (
  difficulty: string,
  problemId: string,
  userId: User
): boolean => {
  const isRewarded = userId.wallet?.transactions?.some(
    (some) => some.problemId === problemId
  );

  if (isRewarded) {
    console.log("user is already rewarded");
    return false;
  }

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
        console.error("Gas estimation failed:", error);
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
