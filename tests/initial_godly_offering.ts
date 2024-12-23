import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { InitialGodlyOffering } from "../target/types/initial_godly_offering";
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';

describe("igo_mock", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.InitialGodlyOffering as Program<InitialGodlyOffering>;

  it("Makes a godly offering of 0.1 SOL", async () => {
    // Find PDA for the vault
    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("divine_vault")],
      program.programId
    );

    // Get initial balances
    const initialUserBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    const initialVaultBalance = await provider.connection.getBalance(vaultPDA);

    // Make the offering
    const tx = await program.methods
      .godlyOffering()
      .accounts({
        user: provider.wallet.publicKey,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Get final balances
    const finalUserBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    const finalVaultBalance = await provider.connection.getBalance(vaultPDA);

    // Check that 0.1 SOL was transferred (100000000 lamports)
    const expectedTransfer = 100000000;
    expect(initialUserBalance - finalUserBalance).to.be.approximately(
      expectedTransfer,
      1000000 // Allow for some deviation due to transaction fees
    );
    expect(finalVaultBalance - initialVaultBalance).to.equal(expectedTransfer);

    console.log("Transaction signature:", tx);
    console.log("SOL transferred to vault:", expectedTransfer / anchor.web3.LAMPORTS_PER_SOL);
  });
});
