import { SKU } from '../types/InventoryTypes';

export interface VoiceCommandResult {
    intent: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CHECKOUT' | 'UNKNOWN';
    productKeyword?: string;
    qty?: number;
    confidence: number;
    rawText: string;
}

export class VoiceCommandKernel {
    private static readonly INTENT_PATTERNS = {
        ADD_TO_CART: /(tambah|masukin|beli|ambil)\s+(.+)/i,
        REMOVE_FROM_CART: /(hapus|buang|batal)\s+(.+)/i,
        CHECKOUT: /(bayar|selesai|bungkus|nota)/i
    };

    private static readonly NUMBER_MAP: Record<string, number> = {
        'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
        'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10
    };

    public static parse(transcript: string): VoiceCommandResult {
        const cleanText = transcript.toLowerCase().trim();
        let intent: VoiceCommandResult['intent'] = 'UNKNOWN';
        let productKeyword: string | undefined;
        let qty = 1;

        // 1. Detect Intent
        if (this.INTENT_PATTERNS.CHECKOUT.test(cleanText)) {
            return { intent: 'CHECKOUT', confidence: 0.9, rawText: cleanText };
        }

        const addMatch = cleanText.match(this.INTENT_PATTERNS.ADD_TO_CART);
        if (addMatch) {
            intent = 'ADD_TO_CART';
            // Parse Qty if spoken (e.g., "dua sabun")
            const parts = addMatch[2].split(' ');
            const firstWord = parts[0];

            if (this.NUMBER_MAP[firstWord] || !isNaN(parseInt(firstWord))) {
                qty = this.NUMBER_MAP[firstWord] || parseInt(firstWord);
                productKeyword = parts.slice(1).join(' ');
            } else {
                productKeyword = addMatch[2];
            }
        }

        return {
            intent,
            productKeyword,
            qty,
            confidence: 0.85,
            rawText: cleanText
        };
    }

    // Levenshtein Distance for Fuzzy Matching
    public static findBestMatch(keyword: string, products: { name: string, sku: SKU }[]): SKU | null {
        if (!keyword) return null;

        let bestSku: SKU | null = null;
        let bestScore = Infinity;

        products.forEach(p => {
            const score = this.levenshtein(keyword, p.name.toLowerCase());
            // Heuristic: Score must be low (close match) relative to length
            if (score < bestScore && score < Math.max(3, p.name.length * 0.4)) {
                bestScore = score;
                bestSku = p.sku;
            }
        });

        return bestSku;
    }

    private static levenshtein(a: string, b: string): number {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
}
