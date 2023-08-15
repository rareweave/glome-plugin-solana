const solanaWeb3 = require('@solana/web3.js');


module.exports = {
    id: "solana",
    setup: async () => {
        const connection = new solanaWeb3.Connection(global.config.gateways.solanaRpc);
        return {
            async readTxById(id) {
                const transaction = await connection.getParsedTransaction(id, "finalized");
                const transferInstruction = transaction.transaction.message.instructions.find(
                    (instruction) => instruction.program == "system" && instruction.parsed.type == "transfer"
                );
                if (!transferInstruction) { return null }
                return {
                    coin: "SOL",
                    timestamp: transaction?.blockTime,
                    amount: transferInstruction.parsed.info.lamports,
                    from: transferInstruction.parsed.info.source,
                    to: transferInstruction.parsed.info.destination,
                }
            }
        }
    }
}