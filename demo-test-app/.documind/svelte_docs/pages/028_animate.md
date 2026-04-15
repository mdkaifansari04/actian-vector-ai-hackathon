# animate: • Svelte Docs

Source: https://svelte.dev/docs/svelte/animate
Fetched: 2026-04-15T18:23:14.111659+00:00

animate: • Svelte Docs
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
# animate:
### On this page
-
animate:
-
Animation Parameters
-
Custom animation functions
An animation is triggered when the contents of a keyed each block are re-ordered. Animations do not run when an element is added or removed, only when the index of an existing data item within the each block changes. Animate directives must be on an element that is an immediate child of a keyed each block.
Animations can be used with Svelte's built-in animation functions or custom animation functions .
<!-- When `list` is reordered the animation will run --> {# each list as item , index (item)} < li animate :flip>{item}</ li > {/ each }
## Animation Parameters
As with actions and transitions, animations can have parameters.
(The double {{curlies}} aren't a special syntax; this is an object literal inside an expression tag.)
{# each list as item , index (item)} < li animate :flip = {{ delay : 500 }}>{item}</ li > {/ each }
## Custom animation functions
animation = ( node : HTMLElement node : HTMLElement , { from : any from : type DOMRect : any DOMRect , to : any to : type DOMRect : any DOMRect } , params : any params : any ) => { delay ? : number , duration ? : number , easing ? : ( t : number t : number ) => number , css ? : ( t : number t : number , u : number u : number ) => string , tick ? : ( t : number t : number , u : number u : number ) => void }
Animations can use custom functions that provide the node , an animation object and any parameters as arguments. The animation parameter is an object containing from and to properties each containing a DOMRect describing the geometry of the element in its start and end positions. The from property is the DOMRect of the element in its starting position, and the to property is the DOMRect of the element in its final position after the list has been reordered and the DOM updated.
If the returned object has a css method, Svelte will create a web animation that plays on the element.
The t argument passed to css is a value that goes from 0 and 1 after the easing function has been applied. The u argument is equal to 1 - t .
The function is called repeatedly before the animation begins, with different t and u arguments.
App
< script > import { cubicOut } from 'svelte/easing' ; /** * @param {HTMLElement} node * @param {{ from: DOMRect; to: DOMRect }} states * @param {any} params */ function whizz (node , { from , to } , params) { const dx = from .left - to .left; const dy = from .top - to .top; const d = Math .sqrt (dx * dx + dy * dy); return { delay : 0 , duration : Math .sqrt (d) * 120 , easing : cubicOut , css : (t , u) => `transform: translate( ${ u * dx } px, ${ u * dy } px) rotate( ${ t * 360 } deg);` }; } </ script > {# each list as item , index (item)} < div animate :whizz>{item}</ div > {/ each }
< script lang = "ts" > import { cubicOut } from 'svelte/easing' ; function whizz (node : HTMLElement , { from , to } : { from : DOMRect ; to : DOMRect } , params : any ) { const dx = from .left - to .left; const dy = from .top - to .top; const d = Math .sqrt (dx * dx + dy * dy); return { delay : 0 , duration : Math .sqrt (d) * 120 , easing : cubicOut , css : (t , u) => `transform: translate( ${ u * dx } px, ${ u * dy } px) rotate( ${ t * 360 } deg);` }; } </ script > {# each list as item , index (item)} < div animate :whizz>{item}</ div > {/ each }
A custom animation function can also return a tick function, which is called during the animation with the same t and u arguments.
If it's possible to use css instead of tick , do so — web animations can run off the main thread, preventing jank on slower devices.
App
< script > import { cubicOut } from 'svelte/easing' ; /** * @param {HTMLElement} node * @param {{ from: DOMRect; to: DOMRect }} states * @param {any} params */ function whizz (node , { from , to } , params) { const dx = from .left - to .left; const dy = from .top - to .top; const d = Math .sqrt (dx * dx + dy * dy); return { delay : 0 , duration : Math .sqrt (d) * 120 , easing : cubicOut , tick : (t , u) => Object .assign ( node .style , { color : t > 0.5 ? 'Pink' : 'Blue' }) }; } </ script > {# each list as item , index (item)} < div animate :whizz>{item}</ div > {/ each }
< script lang = "ts" > import { cubicOut } from 'svelte/easing' ; function whizz (node : HTMLElement , { from , to } : { from : DOMRect ; to : DOMRect } , params : any ) { const dx = from .left - to .left; const dy = from .top - to .top; const d = Math .sqrt (dx * dx + dy * dy); return { delay : 0 , duration : Math .sqrt (d) * 120 , easing : cubicOut , tick : (t , u) => Object .assign ( node .style , { color : t > 0.5 ? 'Pink' : 'Blue' }) }; } </ script > {# each list as item , index (item)} < div animate :whizz>{item}</ div > {/ each }
Edit this page on GitHub llms.txt
previous next
in: and out: style:
