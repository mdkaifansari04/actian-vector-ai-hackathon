# $inspect • Svelte Docs

Source: https://svelte.dev/docs/svelte/$inspect
Fetched: 2026-04-15T18:22:56.451331+00:00

$inspect • Svelte Docs
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
# $inspect
## See also
-
Tutorial Basic Svelte Reactivity Inspecting state
### On this page
-
$inspect
-
$inspect(...).with
-
$inspect.trace(...)
$inspect only works during development. In a production build it becomes a noop.
The $inspect rune is roughly equivalent to console.log , with the exception that it will re-run whenever its argument changes. $inspect tracks reactive state deeply, meaning that updating something inside an object or array using fine-grained reactivity will cause it to re-fire:
App
Open in playground
< script > let count = $ state ( 0 ); let message = $ state ( 'hello' ); $ inspect (count , message); // will console.log when `count` or `message` change </ script > < button onclick = {() => count ++ }>Increment</ button > < input bind : value = {message} />
< script lang = "ts" > let count = $ state ( 0 ); let message = $ state ( 'hello' ); $ inspect (count , message); // will console.log when `count` or `message` change </ script > < button onclick = {() => count ++ }>Increment</ button > < input bind : value = {message} />
On updates, a stack trace will be printed, making it easy to find the origin of a state change (unless you're in the playground, due to technical limitations).
## $inspect(...).with
$inspect(...) returns an object with a with method, which you can invoke with a callback that will then be invoked instead of console.log . The first argument to the callback is either "init" or "update" ; subsequent arguments are the values passed to $inspect :
App
Open in playground
< script > let count = $ state ( 0 ); $ inspect (count) .with ((type , count) => { if (type === 'update' ) { debugger ; // or `console.trace`, or whatever you want } }); </ script > < button onclick = {() => count ++ }>Increment</ button >
< script lang = "ts" > let count = $ state ( 0 ); $ inspect (count) .with ((type , count) => { if (type === 'update' ) { debugger ; // or `console.trace`, or whatever you want } }); </ script > < button onclick = {() => count ++ }>Increment</ button >
## $inspect.trace(...)
This rune, added in 5.14, causes the surrounding function to be traced in development. Any time the function re-runs as part of an effect or a derived , information will be printed to the console about which pieces of reactive state caused the effect to fire.
< script > import { doSomeWork } from './elsewhere' ; $ effect (() => { // $inspect.trace must be the first statement of a function body $ inspect .trace (); doSomeWork (); }); </ script >
$inspect.trace takes an optional first argument which will be used as the label.
Edit this page on GitHub llms.txt
previous next
$bindable $host
