import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'lsp-zero.nvim',
  description: 'A starting point to setup some lsp related features in neovim',
  base: '/docs/',
  outDir: '../../output/docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Documentation: v4.x', link: '/getting-started' },
      { text: 'Tutorial', link: '/tutorial' },
      { text: 'Blog', link: 'https://lsp-zero.netlify.app/blog/' },
      {
        text: 'Community',
        items: [
          { text: 'Github discussions', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/discussions' },
          { text: 'Matrix room', link: 'https://matrix.to/#/#lsp-zero-nvim:matrix.org' },
        ],
      },
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/VonHeikemen/lsp-zero.nvim/tree/v4.x' }
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
        { text: 'Versions', link: '/previous-version' },
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
        { text: 'Lazy loading with lazy.nvim', link: '/guide/lazy-loading-with-lazy-nvim' },
        { text: 'lua_ls for Neovim', link: '/guide/neovim-lua-ls' },
        { text: 'Migrate from v3.x to v4.x', link: '/guide/migrate-from-v3-branch' },
        { text: 'Migrate from v2.x to v4.x', link: '/guide/migrate-from-v2-branch' },
        { text: 'Migrate from v1.x to v4.x', link: '/guide/migrate-from-v1-branch' },
      ]
    },
    {
      text: 'Blog posts',
      collapsed: true,
      items: [
        { text: 'You might not need lsp-zero', link: 'https://lsp-zero.netlify.app/blog/you-might-not-need-lsp-zero.html' },
        { text: 'ThePrimeagen 0 to LSP', link: 'https://lsp-zero.netlify.app/blog/theprimeagens-config-from-2022.html' },
        { text: 'Configure volar 2.0', link: 'https://lsp-zero.netlify.app/blog/configure-volar-v2.html' },
        { text: 'Setup with nvim-jdtls', link: 'https://lsp-zero.netlify.app/blog/setup-with-nvim-jdtls' },
      ]
    }
  ];
}
