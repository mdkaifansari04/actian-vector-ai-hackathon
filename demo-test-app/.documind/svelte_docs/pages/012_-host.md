# $host • Svelte Docs

Source: https://svelte.dev/docs/svelte/$host
Fetched: 2026-04-15T18:22:57.404525+00:00

$host • Svelte Docs
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
# $host
### On this page
-
$host
When compiling a component as a custom element , the $host rune provides access to the host element, allowing you to (for example) dispatch custom events ( demo ):
Stepper
< svelte : options customElement = "my-stepper" /> < script > function dispatch (type) { $ host () .dispatchEvent ( new CustomEvent (type)); } </ script > < button onclick = {() => dispatch ( 'decrement' )}>decrement</ button > < button onclick = {() => dispatch ( 'increment' )}>increment</ button >
< svelte : options customElement = "my-stepper" /> < script lang = "ts" > function dispatch (type) { $ host () .dispatchEvent ( new CustomEvent (type)); } </ script > < button onclick = {() => dispatch ( 'decrement' )}>decrement</ button > < button onclick = {() => dispatch ( 'increment' )}>increment</ button >
App
< script > import './Stepper.svelte' ; let count = $ state ( 0 ); </ script > < my-stepper ondecrement = {() => count -= 1 } onincrement = {() => count += 1 } ></ my-stepper > < p >count: {count}</ p >
< script lang = "ts" > import './Stepper.svelte' ; let count = $ state ( 0 ); </ script > < my-stepper ondecrement = {() => count -= 1 } onincrement = {() => count += 1 } ></ my-stepper > < p >count: {count}</ p >
Edit this page on GitHub llms.txt
previous next
$inspect Basic markup
