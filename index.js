const solanaWeb3 = require('@solana/web3.js');
const nacl=require("tweetnacl")
const bs58=require("bs58")
module.exports = {
    id: "solana",
    setup: async () => {

        const connection = new solanaWeb3.Connection(global.config.gateways.solanaRpc);
        return {
            async verifySignature(signerAddress, message, signature) {
                return await nacl
                    .sign
                    .detached
                    .verify(
                        new TextEncoder().encode(message),
                        bs58.decode(signature),
                        bs58.decode(signerAddress)
                    )
            },
            async readTxById(id) {
                const transaction = await connection.getParsedTransaction(id, "finalized");
                const transferInstruction = (transaction?.transaction?.message?.instructions || []).find(
                    (instruction) => instruction?.program == "system" && instruction?.parsed?.type == "transfer"
                );
                if (!transferInstruction) { return null }
                return {
                    coin: "SOL",
                    timestamp: transaction?.blockTime,
                    amount: transferInstruction?.parsed?.info?.lamports,
                    from: transferInstruction?.parsed.info?.source,
                    to: transferInstruction?.parsed?.info?.destination,
                }
            }
        }
    }
}