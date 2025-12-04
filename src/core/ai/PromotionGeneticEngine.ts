export interface PromoChromosome {
    id: string;
    discountRate: number; // 0.05 - 0.5
    durationDays: number; // 1 - 14
    targetSegment: 'NEW' | 'LOYAL' | 'CHURNED';
    fitness: number; // Score
}

export class PromotionGeneticEngine {
    private static readonly POPULATION_SIZE = 20;
    private static readonly MUTATION_RATE = 0.1;

    /**
     * Initializes random population
     */
    public static initPopulation(): PromoChromosome[] {
        return Array.from({ length: this.POPULATION_SIZE }).map(() => ({
            id: crypto.randomUUID(),
            discountRate: parseFloat((Math.random() * 0.45 + 0.05).toFixed(2)),
            durationDays: Math.floor(Math.random() * 14) + 1,
            targetSegment: ['NEW', 'LOYAL', 'CHURNED'][Math.floor(Math.random() * 3)] as any,
            fitness: 0
        }));
    }

    /**
     * Fitness Function: Simulation of Conversion Rate vs Profit Loss
     */
    public static evaluateFitness(gene: PromoChromosome): number {
        // Heuristic: High discount = High Conversion but Low Margin
        // Optimal is balanced.

        let conversionRate = gene.discountRate * 2; // Simple linear model
        if (gene.targetSegment === 'LOYAL') conversionRate *= 1.5;

        const marginRetained = 1 - gene.discountRate;

        // Fitness = Revenue Impact Score
        // Penalty for too long duration (Saturation)
        const durationPenalty = gene.durationDays > 7 ? 0.9 : 1.0;

        return (conversionRate * marginRetained * durationPenalty) * 100;
    }

    /**
     * Evolve the population (Selection, Crossover, Mutation)
     */
    public static evolve(population: PromoChromosome[]): PromoChromosome[] {
        // 1. Evaluate
        population.forEach(p => p.fitness = this.evaluateFitness(p));

        // 2. Selection (Top 50%)
        const sorted = population.sort((a, b) => b.fitness - a.fitness);
        const survivors = sorted.slice(0, this.POPULATION_SIZE / 2);
        const nextGen: PromoChromosome[] = [...survivors];

        // 3. Crossover & Mutation
        while (nextGen.length < this.POPULATION_SIZE) {
            const parentA = survivors[Math.floor(Math.random() * survivors.length)];
            const parentB = survivors[Math.floor(Math.random() * survivors.length)];

            const child: PromoChromosome = {
                id: crypto.randomUUID(),
                discountRate: Math.random() > 0.5 ? parentA.discountRate : parentB.discountRate,
                durationDays: Math.floor((parentA.durationDays + parentB.durationDays) / 2),
                targetSegment: parentA.targetSegment, // Inherit from A
                fitness: 0
            };

            // Mutation
            if (Math.random() < this.MUTATION_RATE) {
                child.discountRate = parseFloat((Math.random() * 0.45 + 0.05).toFixed(2)); // Random mutation
            }

            nextGen.push(child);
        }

        return nextGen;
    }
}
