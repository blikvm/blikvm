import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useSiteLanguage from '@site/src/components/useSiteLanguage';
import styles from './hp-bios.module.css';

export default function HpBiosCase() {
  const {t} = useSiteLanguage();
  const screenshot = useBaseUrl('/assets/images/cases/hp-bios-kvm-orch.png');
  const title = t('基于 BliKVM 的 HP 电脑 BIOS 自动化测试', 'HP PC BIOS testing with BliKVM');
  return <Layout title={title} description={t('社区用户通过 KVM-Orch 组织 BIOS 测试、远程画面查看与截图留档的案例。', 'A community example of BIOS test orchestration, remote video and screenshot evidence with KVM-Orch.')}>
    <main className={styles.page}>
      <header><p className={styles.eyebrow}>{t('用户案例 / BIOS 测试', 'COMMUNITY / BIOS TESTING')}</p><h1>{title}</h1>
        <p className={styles.lead}>{t('把 BIOS 操作、测试用例和截图证据放在同一个控制台。', 'BIOS interaction, test cases and screenshot evidence in one console.')}</p>
        <p>{t('社区用户分享了基于 BliKVM 构建的 KVM-Orch 测试控制台，用于组织 HP 电脑的 BIOS 测试。左侧呈现目标电脑的启动画面，右侧管理测试用例，下方记录执行过程。', 'A community user shared KVM-Orch, a test console built around BliKVM for HP PC BIOS testing. It combines the target startup screen, a test suite and an execution log.')}</p>
      </header>
      <figure><a href={screenshot} target="_blank" rel="noreferrer"><img src={screenshot} alt={t('KVM-Orch 控制台：HP Startup Menu、System Information 子项 Pass、截图缩略图与执行日志', 'KVM-Orch showing HP Startup Menu, passing System Information subitems, screenshot thumbnails and logs')} /></a>
        <figcaption>{t('用户提供的实际界面截图。点击查看原图；截图展示某次执行状态，不代表全部测试项均已通过。', 'Actual interface shared by a user. Click to view full size. This is one execution snapshot, not evidence that every test passed.')}</figcaption></figure>
      <section><h2>{t('从截图中可以看到什么', 'What the screenshot shows')}</h2><div className={styles.grid}>
        {[
          [t('远程查看启动画面', 'Remote startup video'), t('左侧显示 HP Startup Menu，界面标注 WebRTC 实时流，并提供截图、OCR 和远程控制入口。', 'The left pane shows HP Startup Menu, a WebRTC live-stream label and controls for screenshots, OCR and remote control.')],
          [t('组织 BIOS 测试用例', 'Organized BIOS test cases'), t('右侧 BIOS Test Suite 按功能分组，展示名称、类型、默认值、截图与结果。System Information 的两个子项显示 Pass。', 'BIOS Test Suite groups cases by feature and shows types, defaults, screenshots and results. Two System Information subitems display Pass.')],
          [t('保留执行过程与证据', 'Execution logs and evidence'), t('下方日志记录导航动作、进入目标节点和截图保存；右侧缩略图让测试记录与画面证据对应起来。', 'Logs record navigation, reaching target nodes and saving screenshots. Thumbnails associate test records with visual evidence.')]
        ].map(([heading,body])=><article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}
      </div></section>
      <section><h2>{t('BliKVM 在方案中的作用', 'BliKVM’s role')}</h2><p>{t('BliKVM 提供目标电脑的远程画面与键鼠控制能力，用户自己的测试软件负责组织用例、识别界面、编排操作并汇总结果。KVM-Orch 是用户自建的集成界面，并非 BliKVM 标准软件界面。', 'BliKVM provides remote video and keyboard/mouse control. The user’s test software organizes cases, interprets the interface, orchestrates actions and gathers results. KVM-Orch is a user-built integration, not the standard BliKVM interface.')}</p></section>
      <section><h2>{t('一个适合 BIOS 回归验证的工作方式', 'A workflow for BIOS regression checks')}</h2><ol>
        <li>{t('查看目标电脑当前的启动或 BIOS 画面。', 'Observe the target startup or BIOS screen.')}</li>
        <li>{t('由测试程序选择用例并执行导航操作。', 'Select a case and perform navigation through the test program.')}</li>
        <li>{t('读取页面信息或检查设置，保存相关截图。', 'Inspect information or settings and save relevant screenshots.')}</li>
        <li>{t('将结果、执行日志与截图关联，便于复核。', 'Associate results, logs and screenshots for review.')}</li>
      </ol></section>
    </main>
  </Layout>;
}
