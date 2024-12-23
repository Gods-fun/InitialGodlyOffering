use anchor_lang::prelude::*;

declare_id!("FuU8gdCsC6gfW52nBLjLYid133QYoXX3sQZoQDZChZqS");

#[program]
pub mod initial_godly_offering {
    use super::*;

    pub fn godly_offering(ctx: Context<GodlyOffering>) -> Result<()> {
        let amount = 100000000; // 0.1 SOL in lamports
        
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        
        anchor_lang::system_program::transfer(cpi_context, amount)
    }
}

#[derive(Accounts)]
pub struct GodlyOffering<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is a PDA that only receives SOL
    #[account(
        mut,
        seeds = [b"divine_vault"],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}