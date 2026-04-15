# <svelte:element> • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-element
Fetched: 2026-04-15T18:23:27.357257+00:00

<svelte:element> • Svelte Docs
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
# <svelte:element>
### On this page
-
<svelte:element>
< svelte : element this = {expression} />
The <svelte:element> element lets you render an element that is unknown at author time, for example because it comes from a CMS. Any properties and event listeners present will be applied to the element.
The only supported binding is bind:this , since Svelte's built-in bindings do not work with generic elements.
If this has a nullish value, the element and its children will not be rendered.
If this is the name of a void element (e.g., br ) and <svelte:element> has child elements, a runtime error will be thrown in development mode:
< script > let tag = $ state ( 'hr' ); </ script > < svelte : element this = {tag}> This text cannot appear inside an hr element </ svelte : element >
Svelte tries its best to infer the correct namespace from the element's surroundings, but it's not always possible. You can make it explicit with an xmlns attribute:
< svelte : element this = {tag} xmlns = "http://www.w3.org/2000/svg" />
this needs to be a valid DOM element tag, things like #text or svelte:head will not work.
Edit this page on GitHub llms.txt
previous next
<svelte:head> <svelte:options>
