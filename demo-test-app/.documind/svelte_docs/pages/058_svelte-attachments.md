# svelte/attachments • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-attachments
Fetched: 2026-04-15T18:23:49.345709+00:00

svelte/attachments • Svelte Docs
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
# svelte/ attachments
## See also
-
Tutorial Basic Svelte Attachments The attach tag
-
Docs Svelte Template syntax {@attach ...}
### On this page
-
svelte/attachments
-
createAttachmentKey
-
fromAction
-
Attachment
import { function createAttachmentKey () : symbol
Creates an object key that will be recognised as an attachment when the object is spread onto an element,
as a programmatic alternative to using {@attach ...} . This can be useful for library authors, though
is generally not needed when building an app.
< script > import { createAttachmentKey } from 'svelte/attachments' ; const props = { class : 'cool' , onclick : () => alert ( 'clicked' ) , [ createAttachmentKey ()] : (node) => { node .textContent = 'attached!' ; } }; </ script > < button { ... props } >click me</ button >
@since
5.29
reference
createAttachmentKey , function fromAction < E extends EventTarget , T extends unknown >(action : Action < E , T , Record < never , any >> | ((element : E , arg : T ) => void | ActionReturn < T , Record < never , any >>) , fn : () => T ) : Attachment < E > (+ 1 overload )
Converts an action into an attachment keeping the same behavior.
It's useful if you want to start using attachments on components but you have actions provided by a library.
Note that the second argument, if provided, must be a function that returns the argument to the
action function, not the argument itself.
<!-- with an action --> < div use :foo = {bar}>...</ div > <!-- with an attachment --> < div {@attach fromAction (foo , () => bar) } >...</ div >
reference
fromAction } from 'svelte/attachments' ;
## createAttachmentKey
Available since 5.29
Creates an object key that will be recognised as an attachment when the object is spread onto an element,
as a programmatic alternative to using {@attach ...} . This can be useful for library authors, though
is generally not needed when building an app.
< script > import { createAttachmentKey } from 'svelte/attachments' ; const props = { class : 'cool' , onclick : () => alert ( 'clicked' ) , [ createAttachmentKey ()] : (node) => { node .textContent = 'attached!' ; } }; </ script > < button { ... props } >click me</ button >
function createAttachmentKey () : symbol ;
## fromAction
Converts an action into an attachment keeping the same behavior.
It's useful if you want to start using attachments on components but you have actions provided by a library.
Note that the second argument, if provided, must be a function that returns the argument to the
action function, not the argument itself.
<!-- with an action --> < div use :foo = {bar}>...</ div > <!-- with an attachment --> < div {@attach fromAction (foo , () => bar) } >...</ div >
function fromAction < E extends EventTarget , T extends unknown >( action : | Action < E , T > | ((element : E , arg : T ) => void | ActionReturn < T >) , fn : () => T ) : Attachment < E >;
function fromAction < E extends EventTarget >( action : | Action < E , void > | ((element : E ) => void | ActionReturn < void >) ) : Attachment < E >;
## Attachment
An attachment is a function that runs when an element is mounted
to the DOM, and optionally returns a function that is called when the element is later removed.
It can be attached to an element with an {@attach ...} tag, or by spreading an object containing
a property created with createAttachmentKey .
interface Attachment < T extends EventTarget = Element > { … }
(element : T ) : void | (() => void );
Edit this page on GitHub llms.txt
previous next
svelte/animate svelte/compiler
