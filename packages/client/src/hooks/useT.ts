import { useTranslation } from "react-i18next";
import type { TranslationKeys } from "../locales/translation.type";

export const useT = () => {
  const { t } = useTranslation();

  const typedT = (key: TranslationKeys): string => {
    return t(key);
  };

  return typedT;
}