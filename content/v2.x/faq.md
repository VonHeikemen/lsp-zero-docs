---
prev: false
next: false
---

# Frequently Asked Questions

## How do I get rid warnings in my neovim lua config?

lsp-zero has a function that will configure the lua language server for you: [.nvim_lua_ls()](./reference/lua-api#nvim-lua-ls-opts)

## Can I use the Enter key to confirm completion item?

Yes, you can. You can find the details in the autocomplete documentation: [Enter key to confirm completion](./autocomplete#use-enter-to-confirm-completion).

## My luasnip snippet don't show up in completion menu. How do I get them back?

If you have this problem I assume you are migrating from the `v1.x` branch. What you have to do is add the luasnip source in nvim-cmp, then call the correct luasnip loader. You can find more details of this in the [documentation for autocompletion](./autocomplete#add-an-external-collection-of-snippets).

