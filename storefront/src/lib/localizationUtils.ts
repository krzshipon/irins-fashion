export const getLocalizedContent = (
    content: any,
    locale: string,
    fallback: string
): string => {
    if (!content) return fallback;

    // Direct string match (legacy or simple case)
    if (typeof content === 'string') return content;

    // Check strict locale match
    if (content[locale]) {
        return content[locale];
    }

    // Return fallback if requested locale doesn't exist
    // This ensures we show the default language (usually English product.name) 
    // rather than showing wrong language content
    return fallback;
};
