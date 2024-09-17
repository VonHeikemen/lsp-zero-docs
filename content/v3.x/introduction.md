# Introduction

::: info 

You are reading the documentation for lsp-zero v3.x

:::

## What is lsp-zero?

Collection of functions that will help you setup Neovim's LSP client, so you can get IDE-like features with minimum effort.

Out of the box it will help you integrate [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) (an autocompletion plugin) and [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) (a collection of configurations for various language servers).

The goal is to reduce the boilerplate code needed to configure Neovim's LSP client and have autocompletion working.

A minimal configuration can look like this.

```lua
require('lsp-zero')
require('lspconfig').intelephense.setup({})
```

## What does it do?

Here's a demo that shows the features a minimal configuration can enable.

[![asciicast](https://asciinema.org/a/636643.png)](https://asciinema.org/a/636643)

> See in [asciinema](https://asciinema.org/a/636643).

Features shown:

* Linting. Error messages are shown inline. 
* Smart code autocompletion.
* Go to definition of function.
* Autoimport missing class.
* Format selected range.

lsp-zero's role in all of this is to make sure [nvim-lspconfig](https://github.com/hrsh7th/nvim-cmp) and [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) are setup correctly. These two plugins (plus [intelephense](https://intelephense.com/), a language server) are the ones that do the heavy lifting. lsp-zero "connects" them so you can have working setup with very little code.

## How to get started?

If you are new to neovim and you don't have a configuration file (`init.lua`) follow this [step by step tutorial](/tutorial).

If you know how to configure neovim go to the [Getting started section](/getting-started).

