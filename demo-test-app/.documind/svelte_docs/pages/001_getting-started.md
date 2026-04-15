# Getting started • Svelte Docs

Source: https://svelte.dev/docs/svelte/getting-started
Fetched: 2026-04-15T18:22:45.018467+00:00

Getting started • Svelte Docs
Skip to main content
Docs
Docs
Svelte SvelteKit CLI AI
Tutorial Packages Playground Blog
-
### Introduction
-
Overview
-
Getting started
-
.svelte files
-
.svelte.js and .svelte.ts files
-
### Runes
-
What are runes?
-
$state
-
$derived
-
$effect
-
$props
-
$bindable
-
$inspect
-
$host
-
### Template syntax
-
Basic markup
-
{#if ...}
-
{#each ...}
-
{#key ...}
-
{#await ...}
-
{#snippet ...}
-
{@render ...}
-
{@html ...}
-
{@attach ...}
-
{@const ...}
-
{@debug ...}
-
bind:
-
use:
-
transition:
-
in: and out:
-
animate:
-
style:
-
class
-
await
-
### Styling
-
Scoped styles
-
Global styles
-
Custom properties
-
Nested <style> elements
-
### Special elements
-
<svelte:boundary>
-
<svelte:window>
-
<svelte:document>
-
<svelte:body>
-
<svelte:head>
-
<svelte:element>
-
<svelte:options>
-
### Runtime
-
Stores
-
Context
-
Lifecycle hooks
-
Imperative component API
-
Hydratable data
-
### Misc
-
Best practices
-
Testing
-
TypeScript
-
Custom elements
-
Svelte 4 migration guide
-
Svelte 5 migration guide
-
Frequently asked questions
-
### Reference
-
svelte
-
svelte/action
-
svelte/animate
-
svelte/attachments
-
svelte/compiler
-
svelte/easing
-
svelte/events
-
svelte/legacy
-
svelte/motion
-
svelte/reactivity/window
-
svelte/reactivity
-
svelte/server
-
svelte/store
-
svelte/transition
-
Compiler errors
-
Compiler warnings
-
Runtime errors
-
Runtime warnings
-
### Legacy APIs
-
Overview
-
Reactive let/var declarations
-
Reactive $: statements
-
export let
-
$$props and $$restProps
-
on:
-
<slot>
-
$$slots
-
<svelte:fragment>
-
<svelte:component>
-
<svelte:self>
-
Imperative component API
Svelte Introduction
# Getting started
### On this page
-
Getting started
-
Alternatives to SvelteKit
-
Editor tooling
-
Getting help
We recommend using SvelteKit , which lets you build almost anything . It's the official application framework from the Svelte team and powered by Vite . Create a new project with:
npx sv create myapp cd myapp npm install npm run dev
Don't worry if you don't know Svelte yet! You can ignore all the nice features SvelteKit brings on top for now and dive into it later.
## Alternatives to SvelteKit
You can also use Svelte directly with Vite via vite-plugin-svelte by running npm create vite@latest and selecting the svelte option (or, if working with an existing project, adding the plugin to your vite.config.js file). With this, npm run build will generate HTML, JS, and CSS files inside the dist directory. In most cases, you will probably need to choose a routing library as well.
Vite is often used in standalone mode to build single page apps (SPAs) , which you can also build with SvelteKit .
There are also plugins for other bundlers , but we recommend Vite.
## Editor tooling
The Svelte team maintains a VS Code extension , and there are integrations with various other editors and tools as well.
You can also check your code from the command line using npx sv check .
## Getting help
Don't be shy about asking for help in the Discord chatroom ! You can also find answers on Stack Overflow .
Edit this page on GitHub llms.txt
previous next
Overview .svelte files
