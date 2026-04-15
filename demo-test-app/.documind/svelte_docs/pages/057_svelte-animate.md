# svelte/animate • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-animate
Fetched: 2026-04-15T18:23:48.372294+00:00

svelte/animate • Svelte Docs
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
Svelte Reference
# svelte/ animate
### On this page
-
svelte/animate
-
flip
-
AnimationConfig
-
FlipParams
import {
function flip (node : Element , { from , to } : { from : DOMRect ; to : DOMRect ; } , params ?: FlipParams ) : AnimationConfig
The flip function calculates the start and end position of an element and animates between them, translating the x and y values. flip stands for First, Last, Invert, Play .
reference
flip } from 'svelte/animate' ;
## flip
The flip function calculates the start and end position of an element and animates between them, translating the x and y values. flip stands for First, Last, Invert, Play .
function flip ( node : Element , { from , to } : { from : DOMRect ; to : DOMRect ; } , params ?: FlipParams ) : AnimationConfig ;
## AnimationConfig
interface AnimationConfig { … }
delay ?: number;
duration ?: number;
easing ?: (t : number ) => number;
css ?: (t : number , u : number ) => string;
tick ?: (t : number , u : number ) => void ;
## FlipParams
interface FlipParams { … }
delay ?: number;
duration ?: number | ((len : number ) => number);
easing ?: (t : number ) => number;
Edit this page on GitHub llms.txt
previous next
svelte/action svelte/attachments
