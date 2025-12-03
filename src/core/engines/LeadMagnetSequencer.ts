/**
 * LeadMagnetSequencer.ts
 * [LUMEN STRATEGY] Algorithmic density for lead magnet validation and scarcity logic
 * Handles form validation, countdown timers, and submission tracking
 */

export interface LeadMagnetFormData {
    name: string;
    phone: string;
    email?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: {
        name?: string;
        phone?: string;
        email?: string;
    };
}

export interface ScarcityState {
    deadline: Date;
    hoursRemaining: number;
    minutesRemaining: number;
    secondsRemaining: number;
    isExpired: boolean;
}

export class LeadMagnetSequencer {
    private static readonly PHONE_REGEX = /^(\+62|62|0)[0-9]{9,12}$/;
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly SCARCITY_HOURS = 48;

    /**
     * Validate lead magnet form data
     */
    public static validateForm(data: LeadMagnetFormData): ValidationResult {
        const errors: ValidationResult['errors'] = {};
        let isValid = true;

        // Name validation
        if (!data.name || data.name.trim().length < 3) {
            errors.name = 'Nama harus minimal 3 karakter';
            isValid = false;
        }

        // Phone validation (Indonesian format)
        const normalizedPhone = this.normalizePhone(data.phone);
        if (!this.PHONE_REGEX.test(normalizedPhone)) {
            errors.phone = 'Nomor WhatsApp tidak valid (contoh: 081234567890)';
            isValid = false;
        }

        // Email validation (optional)
        if (data.email && !this.EMAIL_REGEX.test(data.email)) {
            errors.email = 'Email tidak valid';
            isValid = false;
        }

        return { isValid, errors };
    }

    /**
     * Normalize Indonesian phone number
     */
    public static normalizePhone(phone: string): string {
        // Remove all non-digit characters
        let normalized = phone.replace(/\D/g, '');

        // Convert 08xx to 628xx
        if (normalized.startsWith('08')) {
            normalized = '62' + normalized.substring(1);
        }

        // Ensure it starts with 62
        if (!normalized.startsWith('62')) {
            normalized = '62' + normalized;
        }

        return normalized;
    }

    /**
     * Calculate scarcity countdown state
     */
    public static calculateScarcity(deadline: Date | string): ScarcityState {
        const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
        const now = new Date();
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0) {
            return {
                deadline: deadlineDate,
                hoursRemaining: 0,
                minutesRemaining: 0,
                secondsRemaining: 0,
                isExpired: true
            };
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            deadline: deadlineDate,
            hoursRemaining: hours,
            minutesRemaining: minutes,
            secondsRemaining: seconds,
            isExpired: false
        };
    }

    /**
     * Generate scarcity deadline from first visit
     */
    public static generateDeadline(firstVisit: Date = new Date()): Date {
        const deadline = new Date(firstVisit);
        deadline.setHours(deadline.getHours() + this.SCARCITY_HOURS);
        return deadline;
    }

    /**
     * Track submission (prevents duplicates)
     */
    public static hasSubmitted(phone: string): boolean {
        const normalizedPhone = this.normalizePhone(phone);
        const submissions = this.getSubmissions();
        return submissions.includes(normalizedPhone);
    }

    /**
     * Record submission
     */
    public static recordSubmission(phone: string): void {
        const normalizedPhone = this.normalizePhone(phone);
        const submissions = this.getSubmissions();

        if (!submissions.includes(normalizedPhone)) {
            submissions.push(normalizedPhone);
            localStorage.setItem('klontong_submissions', JSON.stringify(submissions));
        }
    }

    /**
     * Get all submissions from localStorage
     */
    private static getSubmissions(): string[] {
        try {
            const data = localStorage.getItem('klontong_submissions');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * Format phone for WhatsApp link
     */
    public static formatForWhatsApp(phone: string): string {
        return this.normalizePhone(phone);
    }
}
