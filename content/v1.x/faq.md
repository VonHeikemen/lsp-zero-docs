# Frequently Asked Questions

## How do I display error messages?

If you press `gl` on a line with errors (or warnings) a popup window will show up, it will tell you every "diagnostic" on that line.

## Some of the default keybindings for LSP don't work, what do I do?

By default lsp-zero will not override a keybinding if it's already "taken". Maybe you or another plugin are already using these keybindings. What you can do is modify the option `set_lsp_keymaps` so lsp-zero can force its keybindings.

```lua
set_lsp_keymaps = {preserve_mappings = false},
```

## How do I get rid warnings in my neovim lua config?

lsp-zero has a function that will configure the lua language server for you: [nvim_workspace](./reference/lua-api#nvim-workspace-opts)

## How do I stop icons from moving my screen?

That's neovim's default behavior. Modify the option `signcolumn`, set it to "yes".

If you use lua.

```lua
vim.opt.signcolumn = 'yes'
```

If you use vimscript.

```vim
set signcolumn=yes
```

## The function .setup_nvim_cmp is not taking any effect, what do I do?

nvim-cmp is tricky. First check [Advance usage - customize nvim-cmp](./guide/advance-usage#customize-nvim-cmp), the solution you want might be there.

If the settings you want to modify are not supported by [.setup_nvim_cmp()](./reference/lua-api#setup-nvim-cmp-opts) then follow this example: [The current api is not enough?](./guide/advance-usage#the-current-api-is-not-enough)

## How about adding an option to setup_nv..?

I don't want to add anything to that function.

