import { routing } from "./routing";

export async function getTranslator(locale) {
  // Ensure a valid locale
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // List all namespaces you expect to load
  const namespaces = ["common", "formErrors", "errorCode"]; // Add more if needed

  const allMessages = {};

  for (const ns of namespaces) {
    const importedModule = await import(`../../messages/${locale}/${ns}.json`);
    allMessages[ns] = importedModule.default;
  }

  // Translator function
  return function translate(key, values) {
    const [namespace, ...pathParts] = key.split(".");

    let result = allMessages?.[namespace];
    for (const part of pathParts) {
      result = result?.[part];
      if (!result) break;
    }

    if (typeof result === "string") {
      return result.replace(/\{(\w+)\}/g, (_, k) => values?.[k] ?? `{${k}}`);
    }

    return result ?? key;
  };
}
