# Introduction

::: info 

You are reading the documentation for lsp-zero v1.x

:::

## What is lsp-zero?

The purpose of this plugin is to bundle all the "boilerplate code" necessary to have [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) (a popular autocompletion plugin) and [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) working together. And if you opt in, it can use [mason.nvim](https://github.com/williamboman/mason.nvim) to let you install language servers from inside neovim.

The goal is to reduce the boilerplate code needed to configure Neovim's LSP client and have autocompletion working.

## What does it do?

lsp-zero's role is to make sure [nvim-lspconfig](https://github.com/hrsh7th/nvim-cmp), [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) and [mason.nvim](https://github.com/williamboman/mason.nvim) are setup correctly. These plugins are the ones that do the heavy lifting. lsp-zero "connects" them so you can have working setup with very little code.

## How to get started?

If you are new to neovim and you don't have a configuration file (`init.lua`) follow this [step by step tutorial](/tutorial).

If you know how to configure neovim go to the [Getting started section](/getting-started).

Also consider <a href="/v3.x/blog/you-might-not-need-lsp-zero.html" target="_self">you might not need lsp-zero</a>.

