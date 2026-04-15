# <svelte:boundary> • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-boundary
Fetched: 2026-04-15T18:23:22.472307+00:00

<svelte:boundary> • Svelte Docs
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
Svelte Special elements
# <svelte:boundary>
### On this page
-
<svelte:boundary>
-
Properties
-
pending
-
failed
-
onerror
-
Using transformError
< svelte : boundary onerror = {handler}>...</ svelte : boundary >
This feature was added in 5.3.0
Boundaries allow you to 'wall off' parts of your app, so that you can:
-
provide UI that should be shown when await expressions are first resolving
-
handle errors that occur during rendering or while running effects, and provide UI that should be rendered when an error happens
If a boundary handles an error (with a failed snippet or onerror handler, or both) its existing content will be removed.
Errors occurring outside the rendering process (for example, in event handlers or after a setTimeout or async work) are not caught by error boundaries.
## Properties
For the boundary to do anything, one or more of the following must be provided.
### pending
This snippet will be shown when the boundary is first created, and will remain visible until all the await expressions inside the boundary have resolved ( demo ):
< svelte : boundary > < p >{ await delayed ( 'hello!' )}</ p > {# snippet pending ()} < p >loading...</ p > {/ snippet } </ svelte : boundary >
The pending snippet will not be shown for subsequent async updates — for these, you can use $effect.pending() .
In the playground , your app is rendered inside a boundary with an empty pending snippet, so that you can use await without having to create one.
### failed
If a failed snippet is provided, it will be rendered when an error is thrown inside the boundary, with the error and a reset function that recreates the contents ( demo ):
< svelte : boundary > < FlakyComponent /> {# snippet failed (error , reset)} < button onclick = {reset}>oops! try again</ button > {/ snippet } </ svelte : boundary >
As with snippets passed to components , the failed snippet can be passed explicitly as a property...
< svelte : boundary { failed } >...</ svelte : boundary >
...or implicitly by declaring it directly inside the boundary, as in the example above.
### onerror
If an onerror function is provided, it will be called with the same two error and reset arguments. This is useful for tracking the error with an error reporting service...
< svelte : boundary onerror = {(e) => report (e)}> ... </ svelte : boundary >
...or using error and reset outside the boundary itself:
< script > let error = $ state ( null ); let reset = $ state (() => {}); function onerror (e , r) { error = e; reset = r; } </ script > < svelte : boundary { onerror } > < FlakyComponent /> </ svelte : boundary > {# if error} < button onclick = {() => { error = null ; reset (); }}> oops! try again </ button > {/ if }
If an error occurs inside the onerror function (or if you rethrow the error), it will be handled by a parent boundary if such exists.
## Using transformError
By default, error boundaries have no effect on the server — if an error occurs during rendering, the render as a whole will fail.
Since 5.51 you can control this behaviour for boundaries with a failed snippet, by calling render(...) with a transformError function.
If you're using Svelte via a framework such as SvelteKit, you most likely don't have direct access to the render(...) call — the framework must configure transformError on your behalf. SvelteKit will add support for this in the near future, via the handleError hook.
The transformError function must return a JSON-stringifiable object which will be used to render the failed snippet. This object will be serialized and used to hydrate the snippet in the browser:
import {
function render < Comp extends SvelteComponent < any > | Component < any > , Props extends ComponentProps < Comp > = ComponentProps < Comp >>( ... args : {} extends Props ? [component : Comp extends SvelteComponent < any > ? ComponentType < Comp > : Comp , options ? : { props ?: Omit < Props , "$$slots" | "$$events" >; context ?: Map < any , any >; idPrefix ?: string ; csp ?: Csp ; transformError ?: (error : unknown ) => unknown | Promise < unknown >; }] : [component : Comp extends SvelteComponent < any > ? ComponentType < Comp > : Comp , options : { props : Omit < Props , "$$slots" | "$$events" >; context ?: Map < any , any >; idPrefix ?: string ; csp ?: Csp ; transformError ?: (error : unknown ) => unknown | Promise < unknown >; }]) : RenderOutput
Only available on the server and when compiling with the server option.
Takes a component and returns an object with body and head properties on it, which you can use to populate the HTML when server-rendering your app.
reference
render } from 'svelte/server' ; import
type App = SvelteComponent < Record < string , any > , any , any > const App : LegacyComponentType
App from './App.svelte' ; const { const head : string
HTML that goes into the <head>
head , const body : string
HTML that goes somewhere into the <body>
body } = await
render < SvelteComponent < Record < string , any > , any , any > , Record < string , any >>(component: ComponentType < SvelteComponent < Record < string , any > , any , any >> , options ?: { props? : Omit < Record < string , any> , "$$slots" | "$$events" > | undefined; context? : Map < any , any>; idPrefix? : string; csp ?: Csp; transformError ?: ((error : unknown ) => unknown | Promise < unknown > ) | undefined ; } | undefined ): RenderOutput
Only available on the server and when compiling with the server option.
Takes a component and returns an object with body and head properties on it, which you can use to populate the HTML when server-rendering your app.
reference
render ( const App : LegacyComponentType App , { transformError ?: ((error : unknown ) => unknown | Promise < unknown > ) | undefined transformError : ( error : unknown error ) => { // log the original error, with the stack trace... var console : Console
The console module provides a simple debugging console that is similar to the
JavaScript console mechanism provided by web browsers.
The module exports two specific components:
-
A Console class with methods such as console.log() , console.error() and console.warn() that can be used to write to any Node.js stream.
-
A global console instance configured to write to process.stdout and process.stderr . The global console can be used without importing the node:console module.
Warning : The global console object's methods are neither consistently
synchronous like the browser APIs they resemble, nor are they consistently
asynchronous like all other Node.js streams. See the note on process I/O for
more information.
Example using the global console :
console .log ( 'hello world' ); // Prints: hello world, to stdout console .log ( 'hello %s' , 'world' ); // Prints: hello world, to stdout console .error ( new Error ( 'Whoops, something bad happened' )); // Prints error message and stack trace to stderr: // Error: Whoops, something bad happened // at [eval]:5:15 // at Script.runInThisContext (node:vm:132:18) // at Object.runInThisContext (node:vm:309:38) // at node:internal/process/execution:77:19 // at [eval]-wrapper:6:22 // at evalScript (node:internal/process/execution:76:60) // at node:internal/main/eval_string:23:3 const name = 'Will Robinson' ; console .warn ( `Danger ${ name } ! Danger!` ); // Prints: Danger Will Robinson! Danger!, to stderr
Example using the Console class:
const out = getStreamSomehow (); const err = getStreamSomehow (); const myConsole = new console .Console (out , err); myConsole .log ( 'hello world' ); // Prints: hello world, to out myConsole .log ( 'hello %s' , 'world' ); // Prints: hello world, to out myConsole .error ( new Error ( 'Whoops, something bad happened' )); // Prints: [Error: Whoops, something bad happened], to err const name = 'Will Robinson' ; myConsole .warn ( `Danger ${ name } ! Danger!` ); // Prints: Danger Will Robinson! Danger!, to err
@see
source
console . Console .error (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stderr with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const code = 5 ; console .error ( 'error #%d' , code); // Prints: error #5, to stderr console .error ( 'error' , code); // Prints: error 5, to stderr
If formatting elements (e.g. %d ) are not found in the first string then util.inspect() is called on each argument and the
resulting string values are concatenated. See util.format() for more information.
@since
v0.1.100
error ( error : unknown error ); // ...and return a sanitized user-friendly error // to display in the `failed` snippet return { message : string message : 'An error occurred!' }; } ; });
If transformError throws (or rethrows) an error, render(...) as a whole will fail with that error.
Errors that occur during server-side rendering can contain sensitive information in the message and stack . It's recommended to redact these rather than sending them unaltered to the browser.
If the boundary has an onerror handler, it will be called upon hydration with the deserialized error object.
The mount and hydrate functions also accept a transformError option, which defaults to the identity function. As with render , this function transforms a render-time error before it is passed to a failed snippet or onerror handler.
Edit this page on GitHub llms.txt
previous next
Nested <style> elements <svelte:window>
