import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    errorCode: (await import(`../../messages/${locale}/errorCode.json`))
      .default,
    formErrors: (await import(`../../messages/${locale}/formErrors.json`))
      .default,
    // Add more namespaces if needed
  };

  return {
    locale,
    messages,
  };
});
