/**
 * XETA NEURAL ROUTING ENGINE
 * Balances transaction cost against provider success rates.
 */

export interface ProviderAccount {
    id: string;
    merchant_id: string;
    provider_id: string;
    fee_pct: number;
    fee_fixed: number;
    success_rate: number;
    active: boolean;
}

export class RoutingEngine {
    // Lambda (λ) weighs the importance of success rate vs cost.
    // Higher lambda = prioritize reliability over cheapness.
    private static LAMBDA = 500;

    static async getPrioritizedRoute(accounts: ProviderAccount[], amount: number): Promise<(ProviderAccount & { score: number })[]> {
        if (accounts.length === 0) {
            throw new Error("NO_ACTIVE_PROVIDERS");
        }

        const scoredAccounts = accounts.map(acc => {
            const cost = (amount * (acc.fee_pct / 100)) + acc.fee_fixed;
            const reliabilityPenalty = this.LAMBDA * (1 - acc.success_rate);
            const score = cost + reliabilityPenalty;

            return { ...acc, score };
        });

        // Lowest score wins
        scoredAccounts.sort((a, b) => a.score - b.score);

        return scoredAccounts;
    }

    static async selectBestAccount(accounts: ProviderAccount[], amount: number): Promise<ProviderAccount & { score: number }> {
        const routes = await this.getPrioritizedRoute(accounts, amount);
        return routes[0];
    }
}
