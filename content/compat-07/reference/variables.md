---
prev:
  text: Commands
  link: ./commands

next:
  text: Lua API
  link: ./lua-api
---

# Variables

## g:lsp_zero_extend_cmp

Global variable. When set to `0` then lsp-zero will not integrate with nvim-cmp automatically.

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_extend_cmp = 0
```

Setting the variable using vimscript

```vim
let g:lsp_zero_extend_cmp = 0
```

## g:lsp_zero_extend_lspconfig

Global variable. When set to `0` then lsp-zero will not integrate with lspconfig automatically.

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_extend_lspconfig = 0
```

Setting the variable using vimscript

```vim
let g:lsp_zero_extend_lspconfig = 0
```

## g:lsp_zero_extend_capabilities

When set to `0` then lsp-zero will only send Neovim's default capabilities settings to language servers. This means language servers that respect the `capabilities` settings will stop sending snippets. And also the "extra edits" may stop working, you will not get things like automatically adding a missing import for a completion item.

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_extend_capabilities = 0
```

Setting the variable using vimscript

```vim
let g:lsp_zero_extend_capabilities = 0
```

## g:lsp_zero_ui_float_border

Global variable. Set the style of border of diagnostic floating window, hover window and signature help window. It can have one of these string values: `'none'`, `'single'`, `'double'`, `'rounded'`, `'solid'` or `'shadow'`. The default value is `rounded`. If set to `0` then lsp-zero will not configure the border style.

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_ui_float_border = 'single'
```

Setting the variable using vimscript

```vim
let g:lsp_zero_ui_float_border = 'single'
```

## g:lsp_zero_ui_signcolumn

Global variable. When set to `0` the lsp-zero will not configure the space in the gutter for diagnostics.

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_ui_signcolumn = 0
```

Setting the variable using vimscript

```vim
let g:lsp_zero_ui_signcolumn = 0
```

## g:lsp_zero_api_warnings

Global variable. When set to `0` it will supress the warning messages from deprecated functions. (Note: if you get one of those warnings, know that showing that message is the only thing they do. They are "empty" functions.)

Example:

Setting the variable using lua

```lua
vim.g.lsp_zero_api_warnings = 0
```

Setting the variable using vimscript

```vim
let g:lsp_zero_api_warnings = 0
```

## b:lsp_zero_enable_autoformat

Buffer local variable. When set to `0` lsp-zero will disable format on save for the buffer.

Example:

Setting the variable using lua

```lua
vim.b.lsp_zero_enable_autoformat = 0
```

Setting the variable using vimscript

```vim
let b:lsp_zero_enable_autoformat = 0
```

