// Form validation utilities for LevelUpEd frontend
// Uses similar patterns to Zod backend validation

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
}

// ============================================
// VALIDATION RULES
// ============================================

const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]+$/,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
};

// ============================================
// AUTH VALIDATION
// ============================================

export interface RegisterData {
    email: string;
    password: string;
    username: string;
}

export const validateRegister = (data: Partial<RegisterData>): ValidationResult<RegisterData> => {
    const errors: ValidationError[] = [];

    // Email validation
    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!patterns.email.test(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    } else if (data.email.length > 255) {
        errors.push({ field: 'email', message: 'Email too long' });
    }

    // Password validation
    if (!data.password) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else {
        if (data.password.length < 8) {
            errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
        }
        if (!patterns.hasUppercase.test(data.password)) {
            errors.push({ field: 'password', message: 'Password must contain an uppercase letter' });
        }
        if (!patterns.hasLowercase.test(data.password)) {
            errors.push({ field: 'password', message: 'Password must contain a lowercase letter' });
        }
        if (!patterns.hasNumber.test(data.password)) {
            errors.push({ field: 'password', message: 'Password must contain a number' });
        }
    }

    // Username validation
    if (!data.username) {
        errors.push({ field: 'username', message: 'Username is required' });
    } else {
        if (data.username.length < 3) {
            errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
        }
        if (data.username.length > 30) {
            errors.push({ field: 'username', message: 'Username too long' });
        }
        if (!patterns.username.test(data.username)) {
            errors.push({ field: 'username', message: 'Username can only contain letters, numbers, and underscores' });
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            email: data.email!.toLowerCase().trim(),
            password: data.password!,
            username: data.username!.trim()
        }
    };
};

export interface LoginData {
    email: string;
    password: string;
}

export const validateLogin = (data: Partial<LoginData>): ValidationResult<LoginData> => {
    const errors: ValidationError[] = [];

    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!patterns.email.test(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!data.password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            email: data.email!.toLowerCase().trim(),
            password: data.password!
        }
    };
};

// ============================================
// STUDY GROUP VALIDATION
// ============================================

export interface CreateGroupData {
    name: string;
    topic: string;
    description?: string;
}

export const validateCreateGroup = (data: Partial<CreateGroupData>): ValidationResult<CreateGroupData> => {
    const errors: ValidationError[] = [];

    if (!data.name || data.name.trim().length < 3) {
        errors.push({ field: 'name', message: 'Group name must be at least 3 characters' });
    }
    if (data.name && data.name.length > 100) {
        errors.push({ field: 'name', message: 'Group name too long' });
    }

    if (!data.topic || data.topic.trim().length < 2) {
        errors.push({ field: 'topic', message: 'Topic is required' });
    }

    if (data.description && data.description.length > 500) {
        errors.push({ field: 'description', message: 'Description too long' });
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            name: data.name!.trim(),
            topic: data.topic!.trim(),
            description: data.description?.trim()
        }
    };
};

// ============================================
// CHALLENGE VALIDATION
// ============================================

export interface ChallengeData {
    receiverId: string;
    topic: string;
}

export const validateChallenge = (data: Partial<ChallengeData>): ValidationResult<ChallengeData> => {
    const errors: ValidationError[] = [];

    if (!data.receiverId) {
        errors.push({ field: 'receiverId', message: 'Select a friend to challenge' });
    } else if (!patterns.uuid.test(data.receiverId)) {
        errors.push({ field: 'receiverId', message: 'Invalid friend selection' });
    }

    if (!data.topic || data.topic.trim().length < 1) {
        errors.push({ field: 'topic', message: 'Select a challenge topic' });
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            receiverId: data.receiverId!,
            topic: data.topic!.trim()
        }
    };
};

// ============================================
// SANITIZATION
// ============================================

export const sanitizeInput = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/javascript:/gi, '')
        .trim();
};

// ============================================
// FORM ERROR DISPLAY HELPER
// ============================================

export const getFieldError = (errors: ValidationError[] | undefined, field: string): string | undefined => {
    return errors?.find(e => e.field === field)?.message;
};

export const hasFieldError = (errors: ValidationError[] | undefined, field: string): boolean => {
    return errors?.some(e => e.field === field) ?? false;
};
