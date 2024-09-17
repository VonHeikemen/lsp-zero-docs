import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'lsp-zero.nvim',
  description: 'A starting point to setup some lsp related features in neovim',
  base: '/compat-07/',
  outDir: '../../output/compat-07',
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
        text: 'Version: compat-07',
        items: [
          { text: 'v3.x', link: 'https://lsp-zero.netlify.app/v3.x/introduction.html' },
          { text: 'v2.x', link: 'https://lsp-zero.netlify.app/v2.x/introduction.html' },
          { text: 'v1.x', link: 'https://lsp-zero.netlify.app/v1.x/introduction.html' },
        ],
      },
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/tree/compat-07' }
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
        { text: 'Troubleshoot', link: '/guide/what-to-do-when-lsp-doesnt-start' },
      ]
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Commands', link: '/reference/commands' },
        { text: 'Variables', link: '/reference/variables' },
        { text: 'Lua API', link: '/reference/lua-api' },
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
        { text: 'Integrate with mason.nvim', link: '/guide/integrate-with-mason-nvim' },
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
        { text: 'lua_ls for Neovim', link: '/guide/neovim-lua-ls' },
        { text: 'Migrate from v1.x', link: '/guide/migrate-from-v1-branch' },
      ]
    },
  ];
}
