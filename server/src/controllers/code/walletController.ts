import { Context } from "hono";
import { createWallet, getTokenBalance } from "../../config/blockchainService";
import User from "../../models/User";
import { sendError, sendSuccess } from "../../utils/sendResponse";

const getWallet = async (c: Context) => {
  try {
    const userId = c.req.param("userId");

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return sendError(c, 404, "User not found");
    }

    if (!user.wallet || !user.wallet.address) {
      const newWallet = createWallet();

      user.wallet = {
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        balance: 0,
      };

      await user.save();
    }

    try {
      const blockchainBalance = await getTokenBalance(user.wallet.address);
      const blockchainBalanceFloat = parseFloat(blockchainBalance);
      
      if (!isNaN(blockchainBalanceFloat) && blockchainBalanceFloat !== user.wallet.balance) {
        user.wallet.balance = blockchainBalanceFloat;
        await user.save();
      }
    } catch (error) {
      console.error("Error updating wallet balance:", error);
    }

    return sendSuccess(c, 200, "Wallet retrieved successfully", {
      walletAddress: user.wallet.address,
      balance: user.wallet.balance.toString(),
    });
  } catch (error) {
    console.error("Error retrieving wallet:", error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default { getWallet };