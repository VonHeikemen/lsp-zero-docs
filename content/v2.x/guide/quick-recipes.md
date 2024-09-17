---
prev: false
next: false
---

# Quick Recipes

## Setup with nvim-navic

Here what you need to do is call [nvim-navic](https://github.com/SmiteshP/nvim-navic)'s `.attach` function inside lsp-zero's [.on_attach()](../reference/lua-api#on-attach-callback). 

```lua{6-8}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})

  if client.server_capabilities.documentSymbolProvider then
    require('nvim-navic').attach(client, bufnr)
  end
end)

lsp.setup()
```

## Enable folds with nvim-ufo

Configure [nvim-ufo](https://github.com/kevinhwang91/nvim-ufo) to use the LSP client as a provider.

In this case you need to advertise the "folding capabilities" to the language servers.

```lua
vim.o.foldcolumn = '1'
vim.o.foldlevel = 99 -- Using ufo provider need a large value, feel free to decrease the value
vim.o.foldlevelstart = 99
vim.o.foldenable = true

-- Using ufo provider need remap `zR` and `zM`.
vim.keymap.set('n', 'zR', require('ufo').openAllFolds)
vim.keymap.set('n', 'zM', require('ufo').closeAllFolds)

require('ufo').setup()

local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.set_server_config({
  capabilities = {
    textDocument = {
      foldingRange = {
        dynamicRegistration = false,
        lineFoldingOnly = true
      }
    }
  }
})

lsp.setup()
```

## Enable inlay hints with lsp-inlayhints.nvim

First make sure you setup [lsp-inlayhints.nvim](https://github.com/lvimuser/lsp-inlayhints.nvim). Then, visit the documentation of the language server you want to configure, figure out what options you need to enable. Finally, use `lspconfig` to enable those options and execute the `.on_attach` function of `lsp-inlayhints.nvim`.

Here an example using the lua language server.

```lua{1-2,12}
local ih = require('lsp-inlayhints')
ih.setup()

local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

require('lspconfig').lua_ls.setup({
  on_attach = function(client, bufnr)
    ih.on_attach(client, bufnr)
  end,
  settings = {
    Lua = {
      hint = {
        enable = true,
      },
    },
  },
})

lsp.setup()
```

## Setup with rustaceanvim

Here you just let [rustaceanvim](https://github.com/mrcjkb/rustaceanvim) configure [rust-analyzer](https://github.com/rust-analyzer/rust-analyzer). You simply tell lsp-zero to ignore `rust_analyzer` and share the "capabilities" option.

```lua{7,12-14}
local lsp = require('lsp-zero')

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.skip_server_setup({'rust_analyzer'})

lsp.setup()

vim.g.rustaceanvim = {
  server = {
    capabilities = lsp.get_capabilities()
  },
}
```

## Setup with flutter-tools

The language server for dartls can't be installed with mason.nvim, because is already bundled in the dart sdk. [flutter-tools](https://github.com/akinsho/flutter-tools.nvim) doesn't depend on lspconfig (according to the documentation), so the only thing that make sense to do is add the "capabilities" options to `flutter-tools`.

```lua{10-12}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()

require('flutter-tools').setup({
  lsp = {
    capabilities = lsp.get_capabilities()
  }
})
```

## Setup with nvim-metals

The following is based on the [example configuration](https://github.com/scalameta/nvim-metals/discussions/39) found in [nvim-metals](https://github.com/scalameta/nvim-metals) discussion section.

If I understand correctly, `nvim-metals` is the one that needs to configure the [metals lsp](https://scalameta.org/metals/). So if you installed the LSP server with mason.nvim you need to tell lsp-zero to ignore it. Then add the "capabilities" option to the `metals` config.

```lua{7,15}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.skip_server_setup({'metals'})

lsp.setup()

---
-- Create the configuration for metals
---
local metals_config = require('metals').bare_config()
metals_config.capabilities = lsp.get_capabilities()

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

Here you need to disable the automatic configuration for `hls` and then setup [haskell-tools](https://github.com/mrcjkb/haskell-tools.nvim) after lsp-zero. Note these instructions are for haskell-tools version 2 (from the branch `2.x.x`).

The only option that makes sense to share from lsp-zero is the "capabilities" options.

```lua{7,15-17}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.skip_server_setup({'hls'})

lsp.setup()

---
-- Setup haskell LSP
---
vim.g.haskell_tools = {
  hls = {
    capabilities = lsp.get_capabilities(),
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

