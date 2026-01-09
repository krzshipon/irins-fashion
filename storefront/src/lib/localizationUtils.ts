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

    // Fallback logic
    if (locale === 'bn' && content['en']) return content['en'];
    if (locale === 'en' && content['bn']) return content['bn'];

    // Return first available key if any
    const keys = Object.keys(content);
    if (keys.length > 0) return content[keys[0]];

    return fallback;
};
