# Global styles • Svelte Docs

Source: https://svelte.dev/docs/svelte/global-styles
Fetched: 2026-04-15T18:23:19.567655+00:00

Global styles • Svelte Docs
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
# Global styles
## See also
-
Tutorial Basic Svelte Classes and styles Component styles
### On this page
-
Global styles
-
:global(...)
-
:global
## :global(...)
To apply styles to a single selector globally, use the :global(...) modifier:
< style > :global( body ) { /* applies to <body> */ margin : 0 ; } div :global( strong ) { /* applies to all <strong> elements, in any component, that are inside <div> elements belonging to this component */ color : goldenrod ; } p :global( .big.red ) { /* applies to all <p> elements belonging to this component with `class="big red"`, even if it is applied programmatically (for example by a library) */ } </ style >
If you want to make @keyframes that are accessible globally, you need to prepend your keyframe names with -global- .
The -global- part will be removed when compiled, and the keyframe will then be referenced using just my-animation-name elsewhere in your code.
< style > @keyframes -global-my-animation-name { /* code goes here */ } </ style >
## :global
To apply styles to a group of selectors globally, create a :global {...} block:
< style > :global { /* applies to every <div> in your application */ div { ... } /* applies to every <p> in your application */ p { ... } } .a :global { /* applies to every `.b .c .d` element, in any component, that is inside an `.a` element in this component */ . b . c . d {...} } </ style >
The second example above could also be written as an equivalent .a :global .b .c .d selector, where everything after the :global is unscoped, though the nested form is preferred.
Edit this page on GitHub llms.txt
previous next
Scoped styles Custom properties
