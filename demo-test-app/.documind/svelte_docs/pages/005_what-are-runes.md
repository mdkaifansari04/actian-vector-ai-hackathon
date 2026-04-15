# What are runes? • Svelte Docs

Source: https://svelte.dev/docs/svelte/what-are-runes
Fetched: 2026-04-15T18:22:48.631580+00:00

What are runes? • Svelte Docs
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
Svelte Runes
# What are runes?
### On this page
-
What are runes?
rune /ruːn/ noun
A letter or mark used as a mystical or magic symbol.
Runes are symbols that you use in .svelte and .svelte.js / .svelte.ts files to control the Svelte compiler. If you think of Svelte as a language, runes are part of the syntax — they are keywords .
Runes have a $ prefix and look like functions:
let let message : string message =
function $state < "hello" >(initial : "hello" ) : "hello" (+ 1 overload ) namespace $state
Declares reactive state.
Example:
let count = $state ( 0 );
@see
{@link https://svelte.dev/docs/svelte/$state Documentation}
@param
initial The initial value
$state ( 'hello' );
They differ from normal JavaScript functions in important ways, however:
-
You don't need to import them — they are part of the language
-
They're not values — you can't assign them to a variable or pass them as arguments to a function
-
Just like JavaScript keywords, they are only valid in certain positions (the compiler will help you if you put them in the wrong place)
Legacy mode
Runes didn't exist prior to Svelte 5.
Edit this page on GitHub llms.txt
previous next
.svelte.js and .svelte.ts files $state
