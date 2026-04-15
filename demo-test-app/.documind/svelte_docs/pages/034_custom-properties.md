# Custom properties • Svelte Docs

Source: https://svelte.dev/docs/svelte/custom-properties
Fetched: 2026-04-15T18:23:20.564726+00:00

Custom properties • Svelte Docs
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
# Custom properties
## See also
-
Tutorial Basic Svelte Classes and styles Component styles
### On this page
-
Custom properties
You can pass CSS custom properties — both static and dynamic — to components:
< Slider bind :value min = { 0 } max = { 100 } --track-color = "black" --thumb-color = "rgb({ r } { g } { b })" />
The above code essentially desugars to this:
< svelte-css-wrapper style = "display: contents; --track-color: black; --thumb-color: rgb({ r } { g } { b })" > < Slider bind :value min = { 0 } max = { 100 } /> </ svelte-css-wrapper >
For an SVG element, it would use <g> instead:
< g style = "--track-color: black; --thumb-color: rgb({ r } { g } { b })" > < Slider bind :value min = { 0 } max = { 100 } /> </ g >
Inside the component, we can read these custom properties (and provide fallback values) using var(...) :
< style > .track { background : var (--track-color , #aaa) ; } .thumb { background : var (--thumb-color , blue) ; } </ style >
You don't have to specify the values directly on the component; as long as the custom properties are defined on a parent element, the component can use them. It's common to define custom properties on the :root element in a global stylesheet so that they apply to your entire application.
While the extra element will not affect layout, it will affect any CSS selectors that (for example) use the > combinator to target an element directly inside the component's container.
Edit this page on GitHub llms.txt
previous next
Global styles Nested <style> elements
