---
prev: false
next: false
---

# Quick Recipes

## Setup with nvim-navic

Here what you need to do is call [nvim-navic](https://github.com/SmiteshP/nvim-navic)'s `.attach` function inside lsp-zero's [.on_attach()](../reference/lua-api#on-attach-callback). 

```lua{6-8}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})

  if client.server_capabilities.documentSymbolProvider then
    require('nvim-navic').attach(client, bufnr)
  end
end)
```

## Enable folds with nvim-ufo

Configure [nvim-ufo](https://github.com/kevinhwang91/nvim-ufo) to use LSP client as a provider.

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

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.set_server_config({
  capabilities = {
    textDocument = {
      foldingRange = {
        dynamicRegistration = false,
        lineFoldingOnly = true
      }
    }
  }
})
```

## Enable inlay hints with inlay-hints.nvim

First make sure you setup [inlay-hints.nvim](https://github.com/simrat39/inlay-hints.nvim). Then, visit the documentation of the language server you want to configure, figure out what options you need to enable. Finally, use `lspconfig` to enable those options and execute the `.on_attach` function of `inlay-hints.nvim`.

Here an example using the lua language server.

```lua{1-2,12}
local ih = require('inlay-hints')
ih.setup()

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
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
```

## Setup with rustaceanvim

Here you just let [rustaceanvim](https://github.com/mrcjkb/rustaceanvim) configure [rust-analyzer](https://github.com/rust-analyzer/rust-analyzer).  

Make you sure you call the [.attach()](../reference/lua-api#attach-client-opts) in the `rustaceanvim` config. Also, share the "capabilities" option.

```lua{9,11}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

vim.g.rustaceanvim = {
  server = {
    capabilities = lsp_zero.get_capabilities()
    on_attach = function(client, bufnr)
      lsp_zero.attach(client, bufnr)
    end,
  },
}
```

And if you use `mason-lspconfig` make sure you ignore `rust_analyzer` from the automatic setup.

```lua{5}
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    rust_analyzer = lsp_zero.noop,
  }
})
```

## Setup with flutter-tools

With [flutter-tools](https://github.com/akinsho/flutter-tools.nvim) the only thing that make sense to do is share the "capabilities" option and the `on_attach` hook. So, let flutter-tools initialize the language server, and have lsp-zero configure those two.

```lua{9,11}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('flutter-tools').setup({
  lsp = {
    capabilities = lsp_zero.get_capabilities(),
    on_attach = function(client, bufnr)
      lsp_zero.attach(client, bufnr)
    end,
  }
})
```

## Setup with nvim-metals

The following is based on the [example configuration](https://github.com/scalameta/nvim-metals/discussions/39) found in [nvim-metals](https://github.com/scalameta/nvim-metals) discussion section.

If I understand correctly, `nvim-metals` is the one that needs to configure the [metals lsp](https://scalameta.org/metals/). The only thing that you need to do share is the "capabilities" option and the `on_attach` hook with the new `metals` config.

```lua{11,13}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

---
-- Create the configuration for metals
---
local metals_config = require('metals').bare_config()
metals_config.capabilities = lsp_zero.get_capabilities()
metals_config.on_attach = function(client, bufnr)
  lsp_zero.attach(client, bufnr)
end

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

Note: if you use `mason-lspconfig.nvim` to install the language server, add a custom handler to the setup function.

```lua
require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    metals = function()
      ---
      -- here you will setup nvim-metals
      ---
    end,
  }
})
```

## Setup with haskell-tools

The only option that makes sense to share between [haskell-tools](https://github.com/mrcjkb/haskell-tools.nvim) and lsp-zero is the "capabilities" option. So, let haskell-tools initialize the language server, and have lsp-zero configure the capabilities option and the `on_attach` hook.

```lua{14,16}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

---
-- Setup haskell LSP
---
local haskell_tools = require('haskell-tools')

local hls_config = {
  hls = {
    capabilities = require('lsp-zero').get_capabilities(),
    on_attach = function(client, bufnr)
      lsp_zero.attach(client, bufnr)
      local opts = {buffer = bufnr}

      -- haskell-language-server relies heavily on codeLenses,
      -- so auto-refresh (see advanced configuration) is enabled by default
      vim.keymap.set('n', '<leader>ca', vim.lsp.codelens.run, opts)
      vim.keymap.set('n', '<leader>hs', haskell_tools.hoogle.hoogle_signature, opts)
      vim.keymap.set('n', '<leader>ea', haskell_tools.lsp.buf_eval_all, opts)
    end
  }
}

-- Autocmd that will actually be in charging of starting hls
local hls_augroup = vim.api.nvim_create_augroup('haskell-lsp', {clear = true})
vim.api.nvim_create_autocmd('FileType', {
  group = hls_augroup,
  pattern = {'haskell'},
  callback = function()
    haskell_tools.start_or_attach(hls_config)

    ---
    -- Suggested keymaps that do not depend on haskell-language-server:
    ---

    -- Toggle a GHCi repl for the current package
    vim.keymap.set('n', '<leader>rr', haskell_tools.repl.toggle, opts)

    -- Toggle a GHCi repl for the current buffer
    vim.keymap.set('n', '<leader>rf', function()
      haskell_tools.repl.toggle(vim.api.nvim_buf_get_name(0))
    end, def_opts)

    vim.keymap.set('n', '<leader>rq', haskell_tools.repl.quit, opts)
  end
})
```

Note: if you use `mason-lspconfig.nvim` to install the language server, add a custom handler to the setup function.

```lua
require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    hls = function()
      ---
      -- here you will setup haskell-tools
      ---
    end,
  }
})
```

