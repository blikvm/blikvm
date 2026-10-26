import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
export default function useSiteLanguage() {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const zh = currentLocale === 'zh-CN';
  return {zh, base: zh ? '/zh-CN' : '', t: (chinese, english) => zh ? chinese : english};
}
