# $bindable • Svelte Docs

Source: https://svelte.dev/docs/svelte/$bindable
Fetched: 2026-04-15T18:22:55.625523+00:00

$bindable • Svelte Docs
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
# $bindable
### On this page
-
$bindable
Ordinarily, props go one way, from parent to child. This makes it easy to understand how data flows around your app.
In Svelte, component props can be bound , which means that data can also flow up from child to parent. This isn't something you should do often — overuse can make your data flow unpredictable and your components harder to maintain — but it can simplify your code if used sparingly and carefully.
It also means that a state proxy can be mutated in the child.
Mutation is also possible with normal props, but is strongly discouraged — Svelte will warn you if it detects that a component is mutating state it does not 'own'.
To mark a prop as bindable, we use the $bindable rune:
FancyInput
< script > let { value = $ bindable () , ... props } = $ props (); </ script > < input bind : value = {value} { ... props } /> < style > input { font-family : 'Comic Sans MS' ; color : deeppink ; } </ style >
< script lang = "ts" > let { value = $ bindable () , ... props } = $ props (); </ script > < input bind : value = {value} { ... props } /> < style > input { font-family : 'Comic Sans MS' ; color : deeppink ; } </ style >
Now, a component that uses <FancyInput> can add the bind: directive ( demo ):
App
< script > import FancyInput from './FancyInput.svelte' ; let message = $ state ( 'hello' ); </ script > < FancyInput bind : value = {message} /> < p >{message}</ p >
< script lang = "ts" > import FancyInput from './FancyInput.svelte' ; let message = $ state ( 'hello' ); </ script > < FancyInput bind : value = {message} /> < p >{message}</ p >
The parent component doesn't have to use bind: — it can just pass a normal prop. Some parents don't want to listen to what their children have to say.
In this case, you can specify a fallback value for when no prop is passed at all:
FancyInput
let { let value : any value =
function $bindable < "fallback" >(fallback ?: "fallback" | undefined ) : "fallback" namespace $bindable
Declares a prop as bindable, meaning the parent component can use bind:propName={value} to bind to it.
let { propName = $bindable () } : { propName : boolean } = $props ();
@see
{@link https://svelte.dev/docs/svelte/$bindable Documentation}
$bindable ( 'fallback' ) , ... let props : any props } =
function $props () : any namespace $props
Declares the props that a component accepts. Example:
let { optionalProp = 42 , requiredProp , bindableProp = $bindable () } : { optionalProp ?: number ; requiredProps : string ; bindableProp : boolean } = $props ();
@see
{@link https://svelte.dev/docs/svelte/$props Documentation}
$props ();
Edit this page on GitHub llms.txt
previous next
$props $inspect
