import React from 'react';
import Layout from '@theme/Layout';
import ApiReference from '@site/src/components/ApiReference';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
export default function ApiReferencePage() {
  const {t} = useSiteLanguage();
  return <Layout title={t('API 接口参考', 'API reference')} description={t('BliKVM API 请求参数、响应结构与示例参考。', 'BliKVM API parameters, response schemas and examples.')}><ApiReference /></Layout>;
}
