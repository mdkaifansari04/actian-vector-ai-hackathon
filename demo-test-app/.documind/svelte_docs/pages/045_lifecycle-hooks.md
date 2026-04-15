# Lifecycle hooks • Svelte Docs

Source: https://svelte.dev/docs/svelte/lifecycle-hooks
Fetched: 2026-04-15T18:23:31.661167+00:00

Lifecycle hooks • Svelte Docs
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
Svelte Runtime
# Lifecycle hooks
### On this page
-
Lifecycle hooks
-
onMount
-
onDestroy
-
tick
-
Deprecated: beforeUpdate / afterUpdate
-
Chat window example
In Svelte 5, the component lifecycle consists of only two parts: Its creation and its destruction. Everything in-between — when certain state is updated — is not related to the component as a whole; only the parts that need to react to the state change are notified. This is because under the hood the smallest unit of change is actually not a component, it's the (render) effects that the component sets up upon component initialization. Consequently, there's no such thing as a "before update"/"after update" hook.
## onMount
The onMount function schedules a callback to run as soon as the component has been mounted to the DOM. It must be called during the component's initialisation (but doesn't need to live inside the component; it can be called from an external module).
onMount does not run inside a component that is rendered on the server.
< script > import { onMount } from 'svelte' ; onMount (() => { console .log ( 'the component has mounted' ); }); </ script >
If a function is returned from onMount , it will be called when the component is unmounted.
< script > import { onMount } from 'svelte' ; onMount (() => { const interval = setInterval (() => { console .log ( 'beep' ); } , 1000 ); return () => clearInterval (interval); }); </ script >
This behaviour will only work when the function passed to onMount is synchronous . async functions always return a Promise .
## onDestroy
Schedules a callback to run immediately before the component is unmounted.
Out of onMount , beforeUpdate , afterUpdate and onDestroy , this is the only one that runs inside a server-side component.
< script > import { onDestroy } from 'svelte' ; onDestroy (() => { console .log ( 'the component is being destroyed' ); }); </ script >
## tick
While there's no "after update" hook, you can use tick to ensure that the UI is updated before continuing. tick returns a promise that resolves once any pending state changes have been applied, or in the next microtask if there are none.
< script > import { tick } from 'svelte' ; $ effect .pre (() => { console .log ( 'the component is about to update' ); tick () .then (() => { console .log ( 'the component just updated' ); }); }); </ script >
## Deprecated: beforeUpdate / afterUpdate
Svelte 4 contained hooks that ran before and after the component as a whole was updated. For backwards compatibility, these hooks were shimmed in Svelte 5 but not available inside components that use runes.
< script > import { beforeUpdate , afterUpdate } from 'svelte' ; beforeUpdate (() => { console .log ( 'the component is about to update' ); }); afterUpdate (() => { console .log ( 'the component just updated' ); }); </ script >
Instead of beforeUpdate use $effect.pre and instead of afterUpdate use $effect instead — these runes offer more granular control and only react to the changes you're actually interested in.
### Chat window example
To implement a chat window that autoscrolls to the bottom when new messages appear (but only if you were already scrolled to the bottom), we need to measure the DOM before we update it.
In Svelte 4, we do this with beforeUpdate , but this is a flawed approach — it fires before every update, whether it's relevant or not. In the example below, we need to introduce checks like updatingMessages to make sure we don't mess with the scroll position when someone toggles dark mode.
With runes, we can use $effect.pre , which behaves the same as $effect but runs before the DOM is updated. As long as we explicitly reference messages inside the effect body, it will run whenever messages changes, but not when theme changes.
beforeUpdate , and its equally troublesome counterpart afterUpdate , are therefore deprecated in Svelte 5.
-
Before
-
After
< script > import { beforeUpdate , afterUpdate , tick } from 'svelte' ; let updatingMessages = false ; let theme = $ state ( 'dark' ) ; let messages = $ state ([]) ; let viewport; beforeUpdate (() => { $ effect .pre (() => { if ( ! updatingMessages) return ; messages; const autoscroll = viewport && viewport .offsetHeight + viewport .scrollTop > viewport .scrollHeight - 50 ; if (autoscroll) { tick () .then (() => { viewport .scrollTo ( 0 , viewport .scrollHeight); }); } updatingMessages = false ; }); function handleKeydown (event) { if ( event .key === 'Enter' ) { const text = event . target .value; if ( ! text) return ; updatingMessages = true ; messages = [ ... messages , text]; event . target .value = '' ; } } function toggle () { theme = theme === 'dark' ? 'light' : 'dark' ; } </ script > < div class : dark = {theme === 'dark' }> < div bind : this = {viewport}> {#each messages as message } < p >{message}</ p > { / each} </ div > < input onkeydown = {handleKeydown} /> < button onclick = {toggle}> Toggle dark mode </ button > </ div >
Edit this page on GitHub llms.txt
previous next
Context Imperative component API
