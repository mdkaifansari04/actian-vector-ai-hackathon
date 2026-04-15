# Scoped styles • Svelte Docs

Source: https://svelte.dev/docs/svelte/scoped-styles
Fetched: 2026-04-15T18:23:18.458966+00:00

Scoped styles • Svelte Docs
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
Svelte Styling
# Scoped styles
## See also
-
Tutorial Basic Svelte Introduction Styling
### On this page
-
Scoped styles
-
Specificity
-
Scoped keyframes
Svelte components can include a <style> element containing CSS that belongs to the component. This CSS is scoped by default, meaning that styles will not apply to any elements on the page outside the component in question.
This works by adding a class to affected elements, which is based on a hash of the component styles (e.g. svelte-123xyz ).
< style > p { /* this will only affect <p> elements in this component */ color : burlywood ; } </ style >
## Specificity
Each scoped selector receives a specificity increase of 0-1-0, as a result of the scoping class (e.g. .svelte-123xyz ) being added to the selector. This means that (for example) a p selector defined in a component will take precedence over a p selector defined in a global stylesheet, even if the global stylesheet is loaded later.
In some cases, the scoping class must be added to a selector multiple times, but after the first occurrence it is added with :where(.svelte-xyz123) in order to not increase specificity further.
## Scoped keyframes
If a component defines @keyframes , the name is scoped to the component using the same hashing approach. Any animation rules in the component will be similarly adjusted:
< style > .bouncy { animation : bounce 10 s ; } /* these keyframes are only accessible inside this component */ @keyframes bounce { /* ... */ } </ style >
Edit this page on GitHub llms.txt
previous next
await Global styles
