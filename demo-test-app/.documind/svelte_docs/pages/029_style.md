# style: • Svelte Docs

Source: https://svelte.dev/docs/svelte/style
Fetched: 2026-04-15T18:23:14.921218+00:00

style: • Svelte Docs
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
# style:
## See also
-
Tutorial Basic Svelte Classes and styles The style directive
-
Docs Svelte Template syntax class
### On this page
-
style:
The style: directive provides a shorthand for setting multiple styles on an element.
<!-- These are equivalent --> < div style : color = "red" >...</ div > < div style = "color: red;" >...</ div >
The value can contain arbitrary expressions:
< div style : color = {myColor}>...</ div >
The shorthand form is allowed:
< div style :color>...</ div >
Multiple styles can be set on a single element:
< div style :color style : width = " 12rem " style : background-color = {darkMode ? 'black' : 'white' }>...</ div >
To mark a style as important, use the |important modifier:
< div style :color | important = "red" >...</ div >
When style: directives are combined with style attributes, the directives will take precedence,
even over !important properties:
< div style : color = "red" style = "color: blue" >This will be red</ div > < div style : color = "red" style = "color: blue !important" >This will still be red</ div >
You can set CSS custom properties:
< div style : --columns = {columns}>...</ div >
Edit this page on GitHub llms.txt
previous next
animate: class
