import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

// Documentation for the i18n config can be found at the link below.
// https://www.i18next.com/configuration-options.html

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    // Have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: false,

    interpolation: {
      escapeValue: false, // Not needed for react!!
    },

    react: {
      wait: true
    }
  });


export default i18n;
