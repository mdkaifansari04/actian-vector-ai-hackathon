# {@html ...} • Svelte Docs

Source: https://svelte.dev/docs/svelte/@html
Fetched: 2026-04-15T18:23:05.404977+00:00

{@html ...} • Svelte Docs
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
# {@html ...}
## See also
-
Tutorial Basic Svelte Introduction HTML tags
### On this page
-
{@html ...}
-
Styling
To inject raw HTML into your component, use the {@html ...} tag:
< article > {@ html content} </ article >
Make sure that you either escape the passed string or only populate it with values that are under your control in order to prevent XSS attacks . Never render unsanitized content.
The expression should be valid standalone HTML — this will not work, because </div> is not valid HTML:
{@ html '<div>' }content{@ html '</div>' }
It also will not compile Svelte code.
## Styling
Content rendered this way is 'invisible' to Svelte and as such will not receive scoped styles . In other words, this will not work, and the a and img styles will be regarded as unused:
< article > {@ html content} </ article > < style > article { a { color : hotpink } img { width : 100 % } } </ style >
Instead, use the :global modifier to target everything inside the <article> :
< style > article :global { a { color : hotpink } img { width : 100 % } } </ style >
Edit this page on GitHub llms.txt
previous next
{@render ...} {@attach ...}
