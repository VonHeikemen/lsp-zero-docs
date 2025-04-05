---
prev: false
next: false
outline: [2,3]
---

# LSP client features

> Last updated: 2025-03-27

Here I want to list the features Neovim enables by default and also show what you can do with the LSP client.

## Default keymaps

These keymaps are part of Neovim's defaults. Some of them will be available even if you don't have a language server. But they will use the language server whenever possible.

* `<Ctrl-]>` jump to definition.

* `gq` format lines of code. This is an operator, is not "gq formats the whole file."

* `gO` lists all symbols in the current buffer.

* `<Ctrl-x><Ctrl-o>` will trigger code completion menu.

* `K` display the available documentation for the symbol under the cursor.

* `<Ctrl-w>d` opens a floating window showing the error/warning message in the line under the cursor.

* `[d` and `]d` can be used to move the cursor to the previous and next errors/warnings of the current file.

## New keymaps

Neovim will create these keymaps only when there is a language server active in the current file:

* `grn` renames all references of the symbol under the cursor.

* `gra` shows a list of code actions available in the line under the cursor.

* `grr` lists all the references of the symbol under the cursor.

* `gri` lists all the implementations for the symbol under the cursor.

* `<Ctrl-s>` in insert mode displays the function signature of the symbol under the cursor.

## Custom keymaps

You can also setup your own keymaps when a language server is active. Take this as an oportunity to remap some of the defaults and maybe create new ones.

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local opts = {buffer = event.buf}

    vim.keymap.set('n', '<C-Space>', '<C-x><C-o>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set({'n', 'x'}, 'gq', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)

    vim.keymap.set('n', 'grt', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'grd', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
  end,
})
```

## Opt-in features

Lastly, there are a couple of features that you can enable by calling a function at the right time.

### Completion side effects

These are additional actions a language server can send. It could be something simple like adding parenthesis on a function call, or something more complex like adding a missing import if the completion item is a class name.

You can also enable autotrigger. This will make Neovim show the completion menu when you type a "trigger character" set by the language server.

To opt-in to these features we must call the function [vim.lsp.completion.enable()](https://neovim.io/doc/user/lsp.html#vim.lsp.completion.enable()).

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)

    if client:supports_method('textDocument/completion') then
      vim.lsp.completion.enable(true, client.id, args.buf, {autotrigger = true})
    end
  end,
})
```

### Format on save

Here we implement a basic format on save function. This works by calling the function [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) on the event [BufWritePre](https://neovim.io/doc/user/autocmd.html#BufWritePre).

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)

    if client:supports_method('textDocument/formatting') then
      vim.api.nvim_create_autocmd('BufWritePre', {
        buffer = args.buf,
        callback = function()
          vim.lsp.buf.format({bufnr = args.buf, id = client.id})
        end,
      })
    end
  end,
})
```

### Inlay hints

Inlay hints is like ghost text that show type information of a variable or a function. Do not confuse these hints with the "inline diagnostics" Neovim shows when there is an error in your code.

To use inlay hints you must call the function [vim.lsp.inlay_hint.enable()](https://neovim.io/doc/user/lsp.html#vim.lsp.inlay_hint.enable()).

Is worth mention most language servers have inlay hint disabled. Meaning you have to configure the language server so it can send the type information to the editor.

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)

    if client:supports_method('textDocument/inlayHint') then
      vim.lsp.inlay_hint.enable(true, {bufnr = args.buf})
    end
  end,
})
```

### Highlight word

When the cursor is idle trigger the function [vim.lsp.buf.document_highlight()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.document_highlight()) to highlight the references of the symbol under the cursor.

For this to work properly your colorscheme needs to support the following highlight groups:

* LspReferenceRead
* LspReferenceText
* LspReferenceWrite

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)

    if client:supports_method('textDocument/documentHighlight') then
      local autocmd = vim.api.nvim_create_autocmd
      local augroup = vim.api.nvim_create_augroup('lsp_highlight', {clear = false})

      vim.api.nvim_clear_autocmds({buffer = bufnr, group = augroup})

      autocmd({'CursorHold'}, {
        group = augroup,
        buffer = args.buf,
        callback = vim.lsp.buf.document_highlight,
      })

      autocmd({'CursorMoved'}, {
        group = augroup,
        buffer = args.buf,
        callback = vim.lsp.buf.clear_references,
      })
    end
  end,
})
```

### Simple tab complete

Use the Tab (and shift tab) key to navigate between the items in the completion menu. When the completion menu is not visible and the cursor is in a whitespace character, it will insert a tab character. Else, it will trigger the completion menu.

When the language server can provide code completion it'll use that. Otherwise, it will try to suggest words found in the current buffer.

```lua
vim.opt.completeopt = {'menu', 'menuone', 'noselect', 'noinsert'}
vim.opt.shortmess:append('c')

local function tab_complete()
  if vim.fn.pumvisible() == 1 then
    -- navigate to next item in completion menu
    return '<Down>'
  end

  local c = vim.fn.col('.') - 1
  local is_whitespace = c == 0 or vim.fn.getline('.'):sub(c, c):match('%s')

  if is_whitespace then
    -- insert tab
    return '<Tab>'
  end

  local lsp_completion = vim.bo.omnifunc == 'v:lua.vim.lsp.omnifunc'

  if lsp_completion then
    -- trigger lsp code completion
    return '<C-x><C-o>'
  end

  -- suggest words in current buffer
  return '<C-x><C-n>'
end

local function tab_prev()
  if vim.fn.pumvisible() == 1 then
    -- navigate to previous item in completion menu
    return '<Up>'
  end

  -- insert tab
  return '<Tab>'
end

vim.keymap.set('i', '<Tab>', tab_complete, {expr = true})
vim.keymap.set('i', '<S-Tab>', tab_prev, {expr = true})
```

