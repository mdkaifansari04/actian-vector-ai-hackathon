# {@render ...} • Svelte Docs

Source: https://svelte.dev/docs/svelte/@render
Fetched: 2026-04-15T18:23:04.400794+00:00

{@render ...} • Svelte Docs
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
Svelte Template syntax
# {@render ...}
### On this page
-
{@render ...}
-
Optional snippets
To render a snippet , use a {@render ...} tag.
{# snippet sum (a , b)} < p >{a} + {b} = {a + b}</ p > {/ snippet } {@ render sum ( 1 , 2 )} {@ render sum ( 3 , 4 )} {@ render sum ( 5 , 6 )}
The expression can be an identifier like sum , or an arbitrary JavaScript expression:
{@ render (cool ? coolSnippet : lameSnippet)()}
## Optional snippets
If the snippet is potentially undefined — for example, because it's an incoming prop — then you can use optional chaining to only render it when it is defined:
{@ render children?. ()}
Alternatively, use an {#if ...} block with an :else clause to render fallback content:
{# if children} {@ render children ()} {: else } < p >fallback content</ p > {/ if }
Edit this page on GitHub llms.txt
previous next
{#snippet ...} {@html ...}
