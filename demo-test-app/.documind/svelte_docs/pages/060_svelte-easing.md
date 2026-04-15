# svelte/easing • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-easing
Fetched: 2026-04-15T18:23:52.462969+00:00

svelte/easing • Svelte Docs
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
# svelte/ easing
### On this page
-
svelte/easing
-
backIn
-
backInOut
-
backOut
-
bounceIn
-
bounceInOut
-
bounceOut
-
circIn
-
circInOut
-
circOut
-
cubicIn
-
cubicInOut
-
cubicOut
-
elasticIn
-
elasticInOut
-
elasticOut
-
expoIn
-
expoInOut
-
expoOut
-
linear
-
quadIn
-
quadInOut
-
quadOut
-
quartIn
-
quartInOut
-
quartOut
-
quintIn
-
quintInOut
-
quintOut
-
sineIn
-
sineInOut
-
sineOut
import { function backIn (t : number ) : number
reference
backIn , function backInOut (t : number ) : number
reference
backInOut , function backOut (t : number ) : number
reference
backOut , function bounceIn (t : number ) : number
reference
bounceIn , function bounceInOut (t : number ) : number
reference
bounceInOut , function bounceOut (t : number ) : number
reference
bounceOut , function circIn (t : number ) : number
reference
circIn , function circInOut (t : number ) : number
reference
circInOut , function circOut (t : number ) : number
reference
circOut , function cubicIn (t : number ) : number
reference
cubicIn , function cubicInOut (t : number ) : number
reference
cubicInOut , function cubicOut (t : number ) : number
reference
cubicOut , function elasticIn (t : number ) : number
reference
elasticIn , function elasticInOut (t : number ) : number
reference
elasticInOut , function elasticOut (t : number ) : number
reference
elasticOut , function expoIn (t : number ) : number
reference
expoIn , function expoInOut (t : number ) : number
reference
expoInOut , function expoOut (t : number ) : number
reference
expoOut , function linear (t : number ) : number
reference
linear , function quadIn (t : number ) : number
reference
quadIn , function quadInOut (t : number ) : number
reference
quadInOut , function quadOut (t : number ) : number
reference
quadOut , function quartIn (t : number ) : number
reference
quartIn , function quartInOut (t : number ) : number
reference
quartInOut , function quartOut (t : number ) : number
reference
quartOut , function quintIn (t : number ) : number
reference
quintIn , function quintInOut (t : number ) : number
reference
quintInOut , function quintOut (t : number ) : number
reference
quintOut , function sineIn (t : number ) : number
reference
sineIn , function sineInOut (t : number ) : number
reference
sineInOut , function sineOut (t : number ) : number
reference
sineOut } from 'svelte/easing' ;
## backIn
function backIn (t : number ) : number ;
## backInOut
function backInOut (t : number ) : number ;
## backOut
function backOut (t : number ) : number ;
## bounceIn
function bounceIn (t : number ) : number ;
## bounceInOut
function bounceInOut (t : number ) : number ;
## bounceOut
function bounceOut (t : number ) : number ;
## circIn
function circIn (t : number ) : number ;
## circInOut
function circInOut (t : number ) : number ;
## circOut
function circOut (t : number ) : number ;
## cubicIn
function cubicIn (t : number ) : number ;
## cubicInOut
function cubicInOut (t : number ) : number ;
## cubicOut
function cubicOut (t : number ) : number ;
## elasticIn
function elasticIn (t : number ) : number ;
## elasticInOut
function elasticInOut (t : number ) : number ;
## elasticOut
function elasticOut (t : number ) : number ;
## expoIn
function expoIn (t : number ) : number ;
## expoInOut
function expoInOut (t : number ) : number ;
## expoOut
function expoOut (t : number ) : number ;
## linear
function linear (t : number ) : number ;
## quadIn
function quadIn (t : number ) : number ;
## quadInOut
function quadInOut (t : number ) : number ;
## quadOut
function quadOut (t : number ) : number ;
## quartIn
function quartIn (t : number ) : number ;
## quartInOut
function quartInOut (t : number ) : number ;
## quartOut
function quartOut (t : number ) : number ;
## quintIn
function quintIn (t : number ) : number ;
## quintInOut
function quintInOut (t : number ) : number ;
## quintOut
function quintOut (t : number ) : number ;
## sineIn
function sineIn (t : number ) : number ;
## sineInOut
function sineInOut (t : number ) : number ;
## sineOut
function sineOut (t : number ) : number ;
Edit this page on GitHub llms.txt
previous next
svelte/compiler svelte/events
