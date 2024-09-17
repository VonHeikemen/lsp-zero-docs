import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'lsp-zero.nvim',
  description: 'A starting point to setup some lsp related features in neovim',
  base: '/v2.x/',
  outDir: '../../output/v2.x',
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
        text: 'Version: v2.x',
        items: [
          { text: 'v4.x', link: 'https://lsp-zero.netlify.app/v4.x/introduction.html' },
          { text: 'v3.x', link: 'https://lsp-zero.netlify.app/v3.x/introduction.html' },
          { text: 'v1.x', link: 'https://lsp-zero.netlify.app/v1.x/introduction.html' },
          { text: 'compat-07', link: 'https://lsp-zero.netlify.app/compat-07/introduction.html' },
        ],
      },
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/tree/v2.x' }
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
      ]
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Commands', link: '/reference/commands' },
        { text: 'Lua API', link: '/reference/lua-api' },
        { text: 'Deprecated', link: '/reference/deprecated' },
      ]
    },
    {
      text: 'Templates',
      collapsed: true,
      items: [
        { text: 'Lua config', link: '/template/lua-config' },
        { text: 'vimscript config', link: '/template/vimscript-config' },
        { text: 'Opinionated', link: '/template/opinionated' },
      ],
    },
    {
      text: 'Integrations',
      collapsed: true,
      items: [
        { text: 'Enable folds with nvim-ufo', link: '/guide/quick-recipes#enable-folds-with-nvim-ufo' },
        { text: 'Setup copilot.lua + nvim-cmp', link: '/guide/setup-copilot-lua-plus-nvim-cmp' },
        { text: 'Setup with nvim-jdtls', link: '/guide/setup-with-nvim-jdtls' },
        { text: 'Setup lsp-inlayhints.nvim', link: '/guide/quick-recipes#enable-inlay-hints-with-lsp-inlayhints-nvim' },
        { text: 'Setup with nvim-navic', link: '/guide/quick-recipes#setup-with-nvim-navic' },
        { text: 'Setup with rustaceanvim', link: '/guide/quick-recipes#setup-with-rustaceanvim' },
        { text: 'Setup with flutter-tools', link: '/guide/quick-recipes#setup-with-flutter-tools' },
        { text: 'Setup with nvim-metals', link: '/guide/quick-recipes#setup-with-nvim-metals' },
        { text: 'Setup with haskell-tools', link: '/guide/quick-recipes#setup-with-haskell-tools' },
      ],
    },
    {
      text: 'Guides',
      collapsed: true,
      items: [
        { text: 'lsp-zero under the hood', link: '/guide/under-the-hood' },
        { text: 'Lazy loading with lazy.nvim', link: '/guide/lazy-loading-with-lazy-nvim' },
        { text: 'Migrate from v1.x to v2.x', link: '/guide/migrate-from-v1-branch' },
      ]
    },
  ];
}
