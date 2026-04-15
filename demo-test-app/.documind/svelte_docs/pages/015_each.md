# {#each ...} • Svelte Docs

Source: https://svelte.dev/docs/svelte/each
Fetched: 2026-04-15T18:23:00.351760+00:00

{#each ...} • Svelte Docs
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
# {#each ...}
## See also
-
Tutorial Basic Svelte Logic Each blocks
### On this page
-
{#each ...}
-
Keyed each blocks
-
Each blocks without an item
-
Else blocks
{# each expression as name}...{/ each }
{# each expression as name , index}...{/ each }
Iterating over values can be done with an each block. The values in question can be arrays, array-like objects (i.e. anything with a length property), or iterables like Map and Set . (Internally, they are converted to arrays with Array.from .)
If the value is null or undefined , it is treated the same as an empty array (which will cause else blocks to be rendered, where applicable).
< h1 >Shopping list</ h1 > < ul > {# each items as item} < li >{ item .name} x { item .qty}</ li > {/ each } </ ul >
An each block can also specify an index , equivalent to the second argument in an array.map(...) callback:
{# each items as item , i} < li >{i + 1 }: { item .name} x { item .qty}</ li > {/ each }
## Keyed each blocks
{# each expression as name (key)}...{/ each }
{# each expression as name , index (key)}...{/ each }
If a key expression is provided — which must uniquely identify each list item — Svelte will use it to intelligently update the list when data changes by inserting, moving and deleting items, rather than adding or removing items at the end and updating the state in the middle.
The key can be any object, but strings and numbers are recommended since they allow identity to persist when the objects themselves change.
{# each items as item ( item .id)} < li >{ item .name} x { item .qty}</ li > {/ each } <!-- or with additional index value --> {# each items as item , i ( item .id)} < li >{i + 1 }: { item .name} x { item .qty}</ li > {/ each }
You can freely use destructuring and rest patterns in each blocks.
{# each items as { id , name , qty } , i (id)} < li >{i + 1 }: {name} x {qty}</ li > {/ each } {# each objects as { id , ... rest }} < li >< span >{id}</ span >< MyComponent { ... rest } /></ li > {/ each } {# each items as [id , ... rest]} < li >< span >{id}</ span >< MyComponent values = {rest} /></ li > {/ each }
## Each blocks without an item
{# each expression}...{/ each }
{# each expression , index}...{/ each }
In case you just want to render something n times, you can omit the as part:
App
Open in playground
< div class = "chess-board" > {# each { length : 8 } , rank} {# each { length : 8 } , file} < div class : black = {(rank + file) % 2 === 1 }></ div > {/ each } {/ each } </ div > < style > .chess-board { display : grid ; grid-template-columns : repeat (8 , 1 fr ) ; rows : repeat (8 , 1 fr ) ; border : 1 px solid black ; aspect-ratio : 1 ; . black { background : black ; } } </ style >
## Else blocks
{# each expression as name}...{: else }...{/ each }
An each block can also have an {:else} clause, which is rendered if the list is empty.
{# each todos as todo} < p >{ todo .text}</ p > {: else } < p >No tasks today!</ p > {/ each }
Edit this page on GitHub llms.txt
previous next
{#if ...} {#key ...}
