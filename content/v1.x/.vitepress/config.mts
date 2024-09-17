import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'lsp-zero.nvim',
  description: 'A starting point to setup some lsp related features in neovim',
  base: '/v1.x/',
  outDir: '../../output/v1.x',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Documentation', link: '/getting-started' },
      { text: 'Tutorial', link: '/tutorial' },
      {
        text: 'Community',
        items: [
          { text: 'Github discussions', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/discussions' },
          { text: 'Matrix channel', link: 'https://matrix.to/#/#lsp-zero-nvim:matrix.org' },
        ],
      },
      {
        text: 'Version: v1.x',
        items: [
          { text: 'v4.x', link: 'https://lsp-zero.netlify.app/v4.x/introduction.html' },
          { text: 'v3.x', link: 'https://lsp-zero.netlify.app/v3.x/introduction.html' },
          { text: 'v2.x', link: 'https://lsp-zero.netlify.app/v2.x/introduction.html' },
          { text: 'compat-07', link: 'https://lsp-zero.netlify.app/compat-07/introduction.html' },
        ],
      },
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/tree/v1.x' }
    ]
  }
})

function sidebar() {
  return [
    {
      text: 'Customization',
      items: [
        { text: 'Introduction', link: '/introduction' },
        { text: 'Getting started', link: '/getting-started' },
        { text: 'LSP configuration', link: '/language-server-configuration' },
        { text: 'Autocompletion', link: '/autocomplete' },
        { text: 'Frequent Questions', link: '/faq' },
        { text: 'Troubleshoot', link: '/guide/troubleshoot' },
        { text: 'Advance usage', link: '/guide/advance-usage' },
      ]
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Commands', link: '/reference/commands' },
        { text: 'Lua API', link: '/reference/lua-api' },
      ]
    },
    {
      text: 'Templates',
      items: [
        { text: 'Lua config', link: '/template/lua-config' },
        { text: 'vimscript config', link: '/template/vimscript-config' },
      ],
    },
  ];
}
