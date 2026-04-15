# svelte/action • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-action
Fetched: 2026-04-15T18:23:47.541463+00:00

svelte/action • Svelte Docs
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
# svelte/ action
### On this page
-
svelte/action
-
Action
-
ActionReturn
This module provides types for actions , which have been superseded by attachments .
## Action
Actions are functions that are called when an element is created.
You can use this interface to type such actions.
The following example defines an action that only works on <div> elements
and optionally accepts a parameter which it has a default value for:
export const
const myAction : Action < HTMLDivElement , { someProperty : boolean ; } | undefined >
myAction : type Action = /*unresolved*/ any Action < HTMLDivElement , { someProperty : boolean someProperty : boolean } | undefined > = ( node : any node ,
param : { someProperty : boolean; }
param = { someProperty : boolean someProperty : true }) => { // ... }
Action<HTMLDivElement> and Action<HTMLDivElement, undefined> both signal that the action accepts no parameters.
You can return an object with methods update and destroy from the function and type which additional attributes and events it has.
See interface ActionReturn for more details.
interface Action < Element = HTMLElement , Parameter = undefined , Attributes extends Record < string , any > = Record < never , any > > { … }
< Node extends Element > ( ... args: undefined extends Parameter ? [node: Node , parameter ?: Parameter] : [node: Node , parameter: Parameter] ): void | ActionReturn < Parameter , Attributes > ;
## ActionReturn
Actions can return an object containing the two properties defined in this interface. Both are optional.
-
update: An action can have a parameter. This method will be called whenever that parameter changes,
 immediately after Svelte has applied updates to the markup. ActionReturn and ActionReturn<undefined> both
 mean that the action accepts no parameters.
-
destroy: Method that is called after the element is unmounted
Additionally, you can specify which additional attributes and events the action enables on the applied element.
This applies to TypeScript typings only and has no effect at runtime.
Example usage:
interface Attributes { Attributes .newprop ?: string | undefined newprop ?: string ; 'on:event' : ( e : CustomEvent < boolean > e : interface CustomEvent < T = any >
The CustomEvent interface represents events initialized by an application for any purpose.
MDN Reference
CustomEvent < boolean >) => void ; } export function function myAction (node : HTMLElement , parameter : Parameter ) : ActionReturn < Parameter , Attributes > myAction ( node : HTMLElement node : HTMLElement , parameter : Parameter parameter : type Parameter = /*unresolved*/ any Parameter ) : type ActionReturn = /*unresolved*/ any ActionReturn < type Parameter = /*unresolved*/ any Parameter , Attributes > { // ... return { update : (updatedParameter : any ) => void update : ( updatedParameter : any updatedParameter ) => { ... } , destroy : () => { ... } }; }
interface ActionReturn < Parameter = undefined , Attributes extends Record < string , any > = Record < never , any > > { … }
update ?: (parameter : Parameter ) => void ;
destroy ?: () => void ;
Edit this page on GitHub llms.txt
previous next
svelte svelte/animate
