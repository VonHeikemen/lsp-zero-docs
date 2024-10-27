import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'lsp-zero.nvim',
  description: 'A starting point to setup some lsp related features in neovim',
  base: '/blog/',
  outDir: '../../output/blog',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Documentation: v4.x', link: 'https://lsp-zero.netlify.app/docs/getting-started.html' },
      { text: 'Tutorial', link: 'https://lsp-zero.netlify.app/docs/tutorial.html' },
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
      text: 'Blog posts',
      collapsed: false,
      items: [
        { text: 'You might not need lsp-zero', link: '/you-might-not-need-lsp-zero' },
        { text: 'ThePrimeagen 0 to LSP', link: '/theprimeagens-config-from-2022' },
        { text: 'Configure volar 2.0', link: '/configure-volar-v2' },
        { text: 'Setup with nvim-jdtls', link: '/setup-with-nvim-jdtls' },
        { text: 'Configure efm', link: '/configure-efm' },
      ]
    }
  ];
}
