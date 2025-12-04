import { VoiceCommandResult, VoiceCommandKernel } from './VoiceCommandKernel';

export class RegionalVoiceKernel extends VoiceCommandKernel {

    // Expanded Dictionary for Regional Languages
    private static readonly DIALECT_MAP: Record<string, string> = {
        // Javanese
        'tuku': 'beli',
        'njaluk': 'beli',
        'siji': 'satu',
        'loro': 'dua',
        'telu': 'tiga',
        'papat': 'empat',
        'limo': 'lima',
        'enem': 'enam',
        'pito': 'tujuh',
        'wolu': 'delapan',
        'songo': 'sembilan',
        'sepuluh': 'sepuluh',
        'uwis': 'selesai',
        'wes': 'selesai',

        // Sundanese
        'meser': 'beli',
        'hiji': 'satu',
        'tilu': 'tiga',
        'genep': 'enam',
        'dalapan': 'delapan',
        'salapan': 'sembilan',
        'atos': 'selesai',

        // Madura (Basic)
        'melle': 'beli',
        'settong': 'satu',
        'dhuwa': 'dua',
        'tello': 'tiga',
        'empa': 'empat',
        'lema': 'lima'
    };

    /**
     * Pre-processes transcript to normalize dialects into standard Indonesian
     */
    public static normalizeDialect(transcript: string): string {
        const words = transcript.toLowerCase().split(' ');
        const normalized = words.map(w => this.DIALECT_MAP[w] || w);
        return normalized.join(' ');
    }

    /**
     * Override parse to include normalization step
     */
    public static parsePolyglot(transcript: string): VoiceCommandResult {
        const standardIndonesian = this.normalizeDialect(transcript);
        const result = super.parse(standardIndonesian);

        // Attach original raw text for debugging/display
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any).rawText = transcript;
        return result;
    }
}
