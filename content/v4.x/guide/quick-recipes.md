---
prev: false
next: false
---

# Quick Recipes

## Enable folds with nvim-ufo

Configure [nvim-ufo](https://github.com/kevinhwang91/nvim-ufo) to use Neovim's LSP client as a provider.

In this case you need to advertise the "folding capabilities" to the language servers.

```lua
vim.o.foldcolumn = '1'
vim.o.foldlevel = 99 -- Using ufo provider need a large value, feel free to decrease the value
vim.o.foldlevelstart = 99
vim.o.foldenable = true

require('ufo').setup()

-- Using ufo provider need remap `zR` and `zM`.
vim.keymap.set('n', 'zR', require('ufo').openAllFolds)
vim.keymap.set('n', 'zM', require('ufo').closeAllFolds)

local lsp_zero = require('lsp-zero')

local lsp_capabilities = vim.tbl_deep_extend(
  'force',
  require('cmp_nvim_lsp').default_capabilities(),
  {
    textDocument = {
      foldingRange = {
        dynamicRegistration = false,
        lineFoldingOnly = true
      },
    },
  }
)

local lspconfig_defaults = require('lspconfig').util.default_config
lspconfig_defaults.capabilities = vim.tbl_deep_extend(
  'force',
  lspconfig_defaults.capabilities,
  lsp_capabilities
)
```

## Setup with rustaceanvim

Here you just let [rustaceanvim](https://github.com/mrcjkb/rustaceanvim) configure [rust-analyzer](https://github.com/rust-analyzer/rust-analyzer).  

You can add `cmp_nvim_lsp` "capabilities" to rustaceanvim.

```lua{3}
vim.g.rustaceanvim = {
  server = {
    capabilities = require('cmp_nvim_lsp').default_capabilities(),
  },
}
```

And if you use `mason-lspconfig` make sure you ignore `rust_analyzer` from the automatic setup.

```lua{1,9}
local noop = function() end

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
    rust_analyzer = noop,
  }
})
```

## Setup with flutter-tools

With [flutter-tools](https://github.com/akinsho/flutter-tools.nvim) the only thing that make sense to do is add `cmp_nvim_lsp` capabilities.

```lua{3}
require('flutter-tools').setup({
  lsp = {
    capabilities = require('cmp_nvim_lsp').default_capabilities()
  }
})
```

## Setup with nvim-metals

The following is based on the [example configuration](https://github.com/scalameta/nvim-metals/discussions/39) found in [nvim-metals](https://github.com/scalameta/nvim-metals) discussion section.

If I understand correctly, `nvim-metals` is the one that needs to configure the [metals lsp](https://scalameta.org/metals/). The only thing that you need to do share is the "capabilities" option with the `metals` config.

```lua{5}
---
-- Create the configuration for metals
---
local metals_config = require('metals').bare_config()
metals_config.capabilities = require('cmp_nvim_lsp').default_capabilities()

---
-- Autocmd that will actually be in charging of starting metals
---
local metals_augroup = vim.api.nvim_create_augroup('nvim-metals', {clear = true})
vim.api.nvim_create_autocmd('FileType', {
  group = metals_augroup,
  pattern = {'scala', 'sbt', 'java'},
  callback = function()
    require('metals').initialize_or_attach(metals_config)
  end
})
```

## Setup with haskell-tools

Let [haskell-tools](https://github.com/mrcjkb/haskell-tools.nvim) initialize the language server, and just configure the capabilities option. Note these instructions are for haskell-tools version 2 (from the branch 2.x.x).

```lua{7}
---
-- Setup haskell LSP
---

vim.g.haskell_tools = {
  hls = {
    capabilities = require('cmp_nvim_lsp').default_capabilities(),
  }
}

-- Autocmd that will actually be in charging of starting hls
local hls_augroup = vim.api.nvim_create_augroup('haskell-lsp', {clear = true})
vim.api.nvim_create_autocmd('FileType', {
  group = hls_augroup,
  pattern = {'haskell'},
  callback = function()
    ---
    -- Suggested keymaps from the quick setup section:
    -- https://github.com/mrcjkb/haskell-tools.nvim#quick-setup
    ---

    local ht = require('haskell-tools')
    local bufnr = vim.api.nvim_get_current_buf()
    local def_opts = { noremap = true, silent = true, buffer = bufnr, }
    -- haskell-language-server relies heavily on codeLenses,
    -- so auto-refresh (see advanced configuration) is enabled by default
    vim.keymap.set('n', '<space>ca', vim.lsp.codelens.run, opts)
    -- Hoogle search for the type signature of the definition under the cursor
    vim.keymap.set('n', '<space>hs', ht.hoogle.hoogle_signature, opts)
    -- Evaluate all code snippets
    vim.keymap.set('n', '<space>ea', ht.lsp.buf_eval_all, opts)
    -- Toggle a GHCi repl for the current package
    vim.keymap.set('n', '<leader>rr', ht.repl.toggle, opts)
    -- Toggle a GHCi repl for the current buffer
    vim.keymap.set('n', '<leader>rf', function()
      ht.repl.toggle(vim.api.nvim_buf_get_name(0))
    end, def_opts)
    vim.keymap.set('n', '<leader>rq', ht.repl.quit, opts)
  end
})
```

