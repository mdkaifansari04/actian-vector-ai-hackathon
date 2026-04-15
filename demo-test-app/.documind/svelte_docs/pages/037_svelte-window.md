# <svelte:window> • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-window
Fetched: 2026-04-15T18:23:23.451024+00:00

<svelte:window> • Svelte Docs
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
Svelte Special elements
# <svelte:window>
### On this page
-
<svelte:window>
< svelte : window onevent = {handler} />
< svelte : window bind : prop = {value} />
The <svelte:window> element allows you to add event listeners to the window object without worrying about removing them when the component is destroyed, or checking for the existence of window when server-side rendering.
This element may only appear at the top level of your component — it cannot be inside a block or element.
< script > function handleKeydown (event) { alert ( `pressed the ${ event .key } key` ); } </ script > < svelte : window onkeydown = {handleKeydown} />
You can also bind to the following properties:
-
innerWidth
-
innerHeight
-
outerWidth
-
outerHeight
-
scrollX
-
scrollY
-
online — an alias for window.navigator.onLine
-
devicePixelRatio
All except scrollX and scrollY are readonly.
< svelte : window bind : scrollY = {y} />
Note that the page will not be scrolled to the initial value to avoid accessibility issues. Only subsequent changes to the bound variable of scrollX and scrollY will cause scrolling. If you have a legitimate reason to scroll when the component is rendered, call scrollTo() in an $effect .
Edit this page on GitHub llms.txt
previous next
<svelte:boundary> <svelte:document>
