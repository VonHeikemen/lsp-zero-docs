---
prev:
  text: Commands
  link: ./commands

next:
  text: Lua API
  link: ./lua-api
---

# Variables

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

