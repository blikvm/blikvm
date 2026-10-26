// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BliKVM',
  tagline: 'BliKVM - KVM Over IP',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.blikvm.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'blikvm', // Usually your GitHub org/user name.
  projectName: 'blikvm', // Usually your repo name.
  deploymentBranch: "gh-pages",

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en','zh-CN'],
    localeConfigs: {
    en: { htmlLang: 'en-US' },
    'zh-CN': { htmlLang: 'zh-CN' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Both locales share the same product-manual hierarchy.
          path: process.env.DOCUSAURUS_CURRENT_LOCALE === 'zh-CN'
            ? './i18n/zh-CN/docusaurus-plugin-content-docs/current'
            : './docs',
          sidebarPath: process.env.DOCUSAURUS_CURRENT_LOCALE === 'zh-CN'
            ? './sidebars.zh-CN.js'
            : './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        pages: {
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}', '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**',
          ],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/blikvm-social-card.png',
      algolia: {
        // Algolia DocSearch (recommended by Docusaurus)
        // Configure via environment variables to avoid committing secrets.
        appId: process.env.ALGOLIA_APP_ID || 'EJOBH1QY2R',
        apiKey: process.env.ALGOLIA_API_KEY || 'c62d51d42a4be3e96fda76675ebda14b',
        indexName: process.env.ALGOLIA_INDEX_NAME || 'BliKVM wiki',
        contextualSearch: true,
      },
      navbar: {
        title: 'BliKVM',
        logo: {
          alt: 'BliKVM Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/products',
            label: 'Products',
            position: 'left',
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {href: 'https://blikvm.com/demo/', label: 'Demo', position: 'left', target: '_blank', rel: 'noopener noreferrer'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            to: '/download',
            label: 'Download',
            position: 'left',
          },
          {
            to: '/partner',
            label: 'Partners',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/blikvm/blikvm',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub Repository',
          },
          {
            href: 'https://discord.com/invite/ffTDcauqyZ',
            position: 'right',
            className: 'header-discord-link',
            'aria-label': 'Discord',
          },
          {
            href: 'https://qm.qq.com/q/V0qWcbNoIi',
            position: 'right',
            className: 'header-qq-link',
            'aria-label': 'QQ',
          },
          {
            href: 'mailto:info@blicube.com',
            position: 'right',
            className: 'header-email-link',
            'aria-label': 'Email',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'BliKVM',
            items: [
              {
                label: "BliKVM v4 Allwinner",
                href: "/docs/device-guides/BliKVM-v4-guide",
              },
              {
                label: "BliKVM v3 HAT",
                href: "/docs/device-guides/BliKVM-v3-guide",
              },
              {
                label: "BliKVM v2 PCIe",
                href: "/docs/device-guides/BliKVM-v2-guide",
              },
              {
                label: "BliKVM v1 CM4",
                href: "/docs/device-guides/BliKVM-v1-guide",
              },
            ],
          },
          {
            title: 'Peripherals',
            items: [
              {
                label: "BliSwitch v2",
                href: "/docs/device-guides/BliSwitch-v2-guide",
              }, 
              {
                label: "BliSwitch v1",
                href: "/docs/device-guides/BliSwitch-v1-guide",
              },  
              {
                label: "ATX",
                href: "/docs/accessories/atx-guide",
              },
              {
                label: "HDMI to CSI&I2S",
                href: "/docs/accessories/hdmi-csi-i2s",
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: "GitHub",
                href: "https://github.com/blikvm/blikvm",
                newWindow: true,
              },
              {
                label: "Discord",
                href: "https://discord.com/invite/ffTDcauqyZ",
                newWindow: true,
              },
              {
                label: "QQ",
                href: "https://qm.qq.com/q/V0qWcbNoIi",
                newWindow: true,
              },
              // {
              //   label: "Twitter",
              //   href: "https://twitter.com/yeecord",
              //   newWindow: true,
              // },
              {
                label: "Youtube",
                href: "https://www.youtube.com/@blicube9879",
                newWindow: true,
              },        
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: "info@blicube.com",
                href: "mailto:info@blicube.com",
                newWindow: false,
              },
              {
                label: "AliExpress",
                href: "https://blicube.aliexpress.com/store/1101755276?spm=a2g0o.store_pc_home.1000001.12.5c0050ae6aIIul",
                newWindow: true,
              },
              {
                label: "淘宝",
                href: "https://shop110478222.taobao.com/?spm=a21n57.shop_search.0.0.1294407337Hv3z",
                newWindow: true,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Blicube LLC`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

// Preserve the English footer while keeping Chinese documentation navigation local.
if (process.env.DOCUSAURUS_CURRENT_LOCALE === 'zh-CN') {
  for (const group of config.themeConfig.footer.links) {
    for (const item of group.items) {
      if (item.href?.startsWith('/docs/')) item.href = `/zh-CN${item.href}`;
    }
  }
}


export default config;
