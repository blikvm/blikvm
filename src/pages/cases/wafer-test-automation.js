import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import styles from './wafer-test-automation.module.css';

const exampleMessage = JSON.stringify({
  stage: 'probe_mark_inspection',
  machine_state: 'LOT_PAUSED',
  finding: 'edge_blocking',
  evidence: 'inspection_screenshot',
  next_step: 'review_inspection_detail',
}, null, 2);

export default function WaferTestAutomationCase() {
  const {base, t} = useSiteLanguage();
  const tester = useBaseUrl('/assets/images/cases/wafer-test-console.webp');
  const title = t('半导体晶圆测试的 AI 分析与自动化', 'AI-assisted wafer testing with BliKVM');
  const description = t(
    '采集晶圆测试画面，从现场样本学习并分析针痕检测结果，生成结构化报文，再由 BliKVM 键鼠 API 执行界面操作。',
    'Capture wafer test screens, learn from inspection samples, and turn probe-mark findings into structured messages that guide BliKVM keyboard and mouse actions.',
  );
  const steps = [
    [
      t('采集机台画面', 'Capture the tester screen'),
      t('通过 BliKVM 获取测试画面，保留晶圆图、运行状态和现场截图供分析。', 'Capture the tester display through BliKVM and retain wafer maps, run states, and screenshots for analysis.'),
    ],
    [
      t('用现场样本分析', 'Analyze inspection samples'),
      t('现场工作台用选定样本学习识别目标，将针痕图像与测量值、异常分类和产线判定放在一起核对。', 'The site’s workbench uses selected examples to learn what to identify, then displays probe-mark images alongside measurements, defect categories, and production-line verdicts.'),
    ],
    [
      t('生成结构化报文', 'Generate a structured message'),
      t('把设备状态、发现、截图引用和下一步整理成报文，供后续程序读取，也便于回到对应画面复核。', 'Record machine state, findings, screenshot references, and the next step in a message that the integration can read and trace back to the screen.'),
    ],
    [
      t('通过键鼠 API 操作', 'Execute through the HID API'),
      t('集成程序根据当前画面执行已配置的点击和按键，例如打开检测详情、切换视图或输入文字，再从更新后的画面确认界面状态。', 'The integration checks the current screen and uses the BliKVM keyboard and mouse API for configured actions, such as opening inspection details, switching views, or entering text. A fresh capture shows the resulting state.'),
    ],
  ];

  return (
    <Layout title={title} description={description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.container}>
            <a className={styles.back} href={`${base}/#use-cases`}>
              <span aria-hidden="true">← </span>{t('官网案例', 'Website case studies')}
            </a>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>

        <div className={styles.container}>
          <section className={styles.section} aria-labelledby="wafer-console">
            <h2 id="wafer-console">{t('晶圆测试现场与样本采集', 'Wafer testing and sample capture')}</h2>
            <p>{t(
              '测试画面同时显示晶圆图、批次运行状态、良率以及通过和失败计数。右侧 AI 学习面板列出抓取的画面，方便选取样本、回看状态变化。',
              'The tester shows the wafer map, lot run state, yield, and pass/fail counts. The AI learning panel on the right lists captured screens for selecting samples and reviewing changes over time.',
            )}</p>
            <figure className={styles.screenshot}>
              <a href={tester}>
                <img
                  src={tester}
                  width={2100}
                  height={1036}
                  decoding="async"
                  alt={t('晶圆测试界面中的彩色晶圆图、批次状态和右侧 AI 学习截图列表', 'Color-coded wafer map and lot status, with AI learning snapshots in the right-hand panel')}
                />
              </a>
              <figcaption>{t('现场截图。点击查看晶圆测试画面大图。', 'Field screenshot. Select the image for a full-size view of the tester.')}</figcaption>
            </figure>
          </section>

          <section className={styles.section} aria-labelledby="wafer-workflow">
            <h2 id="wafer-workflow">{t('从现场画面到界面操作', 'From tester screens to UI actions')}</h2>
            <ol className={styles.steps}>
              {steps.map(([heading, body]) => (
                <li key={heading}><h3>{heading}</h3><p>{body}</p></li>
              ))}
            </ol>
          </section>

          <section className={`${styles.section} ${styles.details}`} aria-labelledby="wafer-message">
            <div>
              <h2 id="wafer-message">{t('结构化报文示例', 'Example structured message')}</h2>
              <p>{t(
                '这条示例记录了暂停状态下的一项针痕发现，并指向需要复核的检测详情。字段和取值由现场集成定义。',
                'This example records a probe-mark finding from a paused lot and points to inspection details for review. The site integration defines the fields and values.',
              )}</p>
              <CodeBlock language="json">{exampleMessage}</CodeBlock>
            </div>
            <div>
              <h2>{t('BliKVM 在方案中的作用', 'BliKVM’s role in the integration')}</h2>
              <p>{t(
                '现场工作台负责样本学习、检测分析和报文生成。BliKVM 提供机台画面采集，并通过 USB HID 将 API 发出的点击与按键送到被控设备。',
                'The site workbench handles sample learning, inspection analysis, and message generation. BliKVM captures the tester display and delivers API-driven clicks and keystrokes to the target through USB HID.',
              )}</p>
              <Link to={`${base}/docs/development/api`}>
                {t('查看 BliKVM OpenAPI', 'View BliKVM OpenAPI')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
