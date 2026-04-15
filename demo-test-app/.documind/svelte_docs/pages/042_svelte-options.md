# <svelte:options> • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-options
Fetched: 2026-04-15T18:23:28.085406+00:00

<svelte:options> • Svelte Docs
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
# <svelte:options>
### On this page
-
<svelte:options>
< svelte : options option = {value} />
The <svelte:options> element provides a place to specify per-component compiler options, which are detailed in the compiler section . The possible options are:
-
runes={true} — forces a component into runes mode (see the Legacy APIs section)
-
runes={false} — forces a component into legacy mode
-
namespace="..." — the namespace where this component will be used, can be "html" (the default), "svg" or "mathml"
-
customElement={...} — the options to use when compiling this component as a custom element. If a string is passed, it is used as the tag option
-
css="injected" — the component will inject its styles inline: During server-side rendering, it's injected as a <style> tag in the head , during client side rendering, it's loaded via JavaScript
Legacy mode
Deprecated options
Svelte 4 also included the following options. They are deprecated in Svelte 5 and non-functional in runes mode.
-
immutable={true} — you never use mutable data, so the compiler can do simple referential equality checks to determine if values have changed
-
immutable={false} — the default. Svelte will be more conservative about whether or not mutable objects have changed
-
accessors={true} — adds getters and setters for the component's props
-
accessors={false} — the default
< svelte : options customElement = "my-custom-element" />
Edit this page on GitHub llms.txt
previous next
<svelte:element> Stores
