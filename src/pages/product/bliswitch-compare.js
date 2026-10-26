import React from 'react';
import Layout from '@theme/Layout';
import ProductCatalog from '@site/src/components/ChineseProductCatalog';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
export default function ComparisonPage() {
  const {t} = useSiteLanguage();
  return <Layout title={t('产品选型', 'Product selection')}><ProductCatalog family={["bliswitch"]} /></Layout>;
}
