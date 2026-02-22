import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // For now, default to English. In the future, this can be
    // determined from cookies, headers, or a user preference.
    const locale = 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
