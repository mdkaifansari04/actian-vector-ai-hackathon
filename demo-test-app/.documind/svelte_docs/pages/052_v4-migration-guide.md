# Svelte 4 migration guide • Svelte Docs

Source: https://svelte.dev/docs/svelte/v4-migration-guide
Fetched: 2026-04-15T18:23:41.643929+00:00

Svelte 4 migration guide • Svelte Docs
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
Svelte Misc
# Svelte 4 migration guide
### On this page
-
Svelte 4 migration guide
-
Minimum version requirements
-
Browser conditions for bundlers
-
Removal of CJS related output
-
Stricter types for Svelte functions
-
Custom Elements with Svelte
-
SvelteComponentTyped is deprecated
-
Transitions are local by default
-
Default slot bindings
-
Preprocessors
-
New eslint package
-
Other breaking changes
This migration guide provides an overview of how to migrate from Svelte version 3 to 4. See the linked PRs for more details about each change. Use the migration script to migrate some of these automatically: npx svelte-migrate@latest svelte-4
If you're a library author, consider whether to only support Svelte 4 or if it's possible to support Svelte 3 too. Since most of the breaking changes don't affect many people, this may be easily possible. Also remember to update the version range in your peerDependencies .
## Minimum version requirements
-
Upgrade to Node 16 or higher. Earlier versions are no longer supported. ( #8566 )
-
If you are using SvelteKit, upgrade to 1.20.4 or newer ( sveltejs/kit#10172 )
-
If you are using Vite without SvelteKit, upgrade to vite-plugin-svelte 2.4.1 or newer ( #8516 )
-
If you are using webpack, upgrade to webpack 5 or higher and svelte-loader 3.1.8 or higher. Earlier versions are no longer supported. ( #8515 , 198dbcf )
-
If you are using Rollup, upgrade to rollup-plugin-svelte 7.1.5 or higher ( 198dbcf )
-
If you are using TypeScript, upgrade to TypeScript 5 or higher. Lower versions might still work, but no guarantees are made about that. ( #8488 )
## Browser conditions for bundlers
Bundlers must now specify the browser condition when building a frontend bundle for the browser. SvelteKit and Vite will handle this automatically for you. If you're using any others, you may observe lifecycle callbacks such as onMount not get called and you'll need to update the module resolution configuration.
-
For Rollup this is done within the @rollup/plugin-node-resolve plugin by setting browser: true in its options. See the rollup-plugin-svelte documentation for more details
-
For webpack this is done by adding "browser" to the conditionNames array. You may also have to update your alias config, if you have set it. See the svelte-loader documentation for more details
( #8516 )
## Removal of CJS related output
Svelte no longer supports the CommonJS (CJS) format for compiler output and has also removed the svelte/register hook and the CJS runtime version. If you need to stay on the CJS output format, consider using a bundler to convert Svelte's ESM output to CJS in a post-build step. ( #8613 )
## Stricter types for Svelte functions
There are now stricter types for createEventDispatcher , Action , ActionReturn , and onMount :
-
createEventDispatcher now supports specifying that a payload is optional, required, or non-existent, and the call sites are checked accordingly ( #7224 )
import { function createEventDispatcher < EventMap extends Record < string , any > = any >() : EventDispatcher < EventMap >
Creates an event dispatcher that can be used to dispatch component events .
Event dispatchers are functions that can take two arguments: name and detail .
Component events created with createEventDispatcher create a CustomEvent .
These events do not bubble .
The detail argument corresponds to the CustomEvent.detail property and can contain any type of data.
The event dispatcher can be typed to narrow the allowed event names and the type of the detail argument:
const const dispatch : any dispatch = createEventDispatcher <{ loaded : null loaded : null ; // does not take a detail argument change : string change : string ; // takes a detail argument of type string, which is required optional : number | null optional : number | null ; // takes an optional detail argument of type number }>();
@deprecated
Use callback props and/or the $host() rune instead — see migration guide
reference
createEventDispatcher } from 'svelte' ; const
const dispatch : EventDispatcher <{ optional : number | null ; required : string ; noArgument : null ; }>
dispatch =
createEventDispatcher <{ optional : number | null ; required : string ; noArgument : null ; }>() : EventDispatcher <{ optional : number | null ; required : string ; noArgument : null ; }>
Creates an event dispatcher that can be used to dispatch component events .
Event dispatchers are functions that can take two arguments: name and detail .
Component events created with createEventDispatcher create a CustomEvent .
These events do not bubble .
The detail argument corresponds to the CustomEvent.detail property and can contain any type of data.
The event dispatcher can be typed to narrow the allowed event names and the type of the detail argument:
const const dispatch : any dispatch = createEventDispatcher <{ loaded : null loaded : null ; // does not take a detail argument change : string change : string ; // takes a detail argument of type string, which is required optional : number | null optional : number | null ; // takes an optional detail argument of type number }>();
@deprecated
Use callback props and/or the $host() rune instead — see migration guide
reference
createEventDispatcher <{ optional : number | null optional : number | null ; required : string required : string ; noArgument : null noArgument : null ; }>(); // Svelte version 3:
const dispatch : EventDispatcher < "optional" > (type : "optional" , parameter ?: number | null | undefined , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'optional' );
const dispatch : EventDispatcher < "required" > (type : "required" , parameter : string , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'required' ); // I can still omit the detail argument
const dispatch : EventDispatcher < "noArgument" > (type : "noArgument" , parameter ?: null | undefined , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'noArgument' , 'surprise' ); // I can still add a detail argument // Svelte version 4 using TypeScript strict mode:
const dispatch : EventDispatcher < "optional" > (type : "optional" , parameter ?: number | null | undefined , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'optional' );
const dispatch : EventDispatcher < "required" > (type : "required" , parameter : string , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'required' ); // error, missing argument
const dispatch : EventDispatcher < "noArgument" > (type : "noArgument" , parameter ?: null | undefined , options ?: DispatchOptions | undefined ) => boolean
dispatch ( 'noArgument' , 'surprise' ); // error, cannot pass an argument
-
Action and ActionReturn have a default parameter type of undefined now, which means you need to type the generic if you want to specify that this action receives a parameter. The migration script will migrate this automatically ( #7442 )
const const action : Action < HTMLElement , string > action : type Action = /*unresolved*/ any Action < HTMLElement , string > = ( node : any node , params : any params ) => { ... } // params is of type string
-
onMount now shows a type error if you return a function asynchronously from it, because this is likely a bug in your code where you expect the callback to be called on destroy, which it will only do for synchronously returned functions ( #8136 )
// Example where this change reveals an actual bug onMount ( // someCleanup() is called because function handed to onMount is sync () => { foo () . then ( something : any something => { ... }); // ... return () => someCleanup (); } );
## Custom Elements with Svelte
The creation of custom elements with Svelte has been overhauled and significantly improved. The tag option is deprecated in favor of the new customElement option:
< svelte : options tag = "my-component" /> < svelte : options customElement = "my-component" />
This change was made to allow more configurability for advanced use cases. The migration script will adjust your code automatically. The update timing of properties has changed slightly as well. ( #8457 )
## SvelteComponentTyped is deprecated
SvelteComponentTyped is deprecated, as SvelteComponent now has all its typing capabilities. Replace all instances of SvelteComponentTyped with SvelteComponent .
import { class SvelteComponent < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any >
This was the base class for Svelte components in Svelte 4. Svelte 5+ components are completely different under the hood. For typing, use Component instead. To instantiate components, use mount instead. See migration guide for more info.
reference
SvelteComponent } from 'svelte' ; export class class Foo Foo extends class SvelteComponent < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any >
This was the base class for Svelte components in Svelte 4. Svelte 5+ components are completely different under the hood. For typing, use Component instead. To instantiate components, use mount instead. See migration guide for more info.
reference
SvelteComponent <{ aProp : string aProp : string }> {}
If you have used SvelteComponent as the component instance type previously, you may see a somewhat opaque type error now, which is solved by changing : typeof SvelteComponent to : typeof SvelteComponent<any> .
< script > import ComponentA from './ComponentA.svelte' ; import ComponentB from './ComponentB.svelte' ; import { SvelteComponent } from 'svelte' ; let component : typeof SvelteComponent < any > ; function choseRandomly () { component = Math .random () > 0.5 ? ComponentA : ComponentB; } </ script > < button on : click = {choseRandomly}>random</ button > < svelte : element this = {component} />
The migration script will do both automatically for you. ( #8512 )
## Transitions are local by default
Transitions are now local by default to prevent confusion around page navigations. "local" means that a transition will not play if it's within a nested control flow block ( each/if/await/key ) and not the direct parent block but a block above it is created/destroyed. In the following example, the slide intro animation will only play when success goes from false to true , but it will not play when show goes from false to true :
{# if show} ... {# if success} < p in :slide>Success</ p > {/ each } {/ if }
To make transitions global, add the |global modifier — then they will play when any control flow block above is created/destroyed. The migration script will do this automatically for you. ( #6686 )
## Default slot bindings
Default slot bindings are no longer exposed to named slots and vice versa:
< script > import Nested from './Nested.svelte' ; </ script > < Nested let :count> < p > count in default slot — is available: {count} </ p > < p slot = "bar" > count in bar slot — is not available: {count} </ p > </ Nested >
This makes slot bindings more consistent as the behavior is undefined when for example the default slot is from a list and the named slot is not. ( #6049 )
## Preprocessors
The order in which preprocessors are applied has changed. Now, preprocessors are executed in order, and within one group, the order is markup, script, style.
import {
function preprocess (source : string , preprocessor : PreprocessorGroup | PreprocessorGroup [] , options ?: { filename ?: string ; } | undefined ) : Promise < Processed >
The preprocess function provides convenient hooks for arbitrarily transforming component source code.
For example, it can be used to convert a <style lang="sass"> block into vanilla CSS.
reference
preprocess } from 'svelte/compiler' ; const { const code : string
The new code
code } = await
function preprocess (source : string , preprocessor : PreprocessorGroup | PreprocessorGroup [] , options ?: { filename ?: string ; } | undefined ) : Promise < Processed >
The preprocess function provides convenient hooks for arbitrarily transforming component source code.
For example, it can be used to convert a <style lang="sass"> block into vanilla CSS.
reference
preprocess ( source , [ { PreprocessorGroup .markup ?: MarkupPreprocessor | undefined markup : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'markup-1' ); } , PreprocessorGroup .script ?: Preprocessor | undefined script : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'script-1' ); } , PreprocessorGroup .style ?: Preprocessor | undefined style : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'style-1' ); } } , { PreprocessorGroup .markup ?: MarkupPreprocessor | undefined markup : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'markup-2' ); } , PreprocessorGroup .script ?: Preprocessor | undefined script : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'script-2' ); } , PreprocessorGroup .style ?: Preprocessor | undefined style : () => { var console : Console
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
console . Console .log (message ?: any , ... optionalParams: any[]): void ( + 1 overload)
Prints to stdout with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to printf(3) (the arguments are all passed to util.format() ).
const count = 5 ; console .log ( 'count: %d' , count); // Prints: count: 5, to stdout console .log ( 'count:' , count); // Prints: count: 5, to stdout
See util.format() for more information.
@since
v0.1.100
log ( 'style-2' ); } } ] , { filename ?: string | undefined filename : 'App.svelte' } ); // Svelte 3 logs: // markup-1 // markup-2 // script-1 // script-2 // style-1 // style-2 // Svelte 4 logs: // markup-1 // script-1 // style-1 // markup-2 // script-2 // style-2
This could affect you for example if you are using MDsveX - in which case you should make sure it comes before any script or style preprocessor.
preprocess : [ mdsvex ( mdsvexConfig ) , vitePreprocess () ]
Each preprocessor must also have a name. ( #8618 )
## New eslint package
eslint-plugin-svelte3 is deprecated. It may still work with Svelte 4 but we make no guarantees about that. We recommend switching to our new package eslint-plugin-svelte . See this Github post for an instruction how to migrate. Alternatively, you can create a new project using npm create svelte@latest , select the eslint (and possibly TypeScript) option and then copy over the related files into your existing project.
## Other breaking changes
-
the inert attribute is now applied to outroing elements to make them invisible to assistive technology and prevent interaction. ( #8628 )
-
the runtime now uses classList.toggle(name, boolean) which may not work in very old browsers. Consider using a polyfill if you need to support these browsers. ( #8629 )
-
the runtime now uses the CustomEvent constructor which may not work in very old browsers. Consider using a polyfill if you need to support these browsers. ( #8775 )
-
people implementing their own stores from scratch using the StartStopNotifier interface (which is passed to the create function of writable etc) from svelte/store now need to pass an update function in addition to the set function. This has no effect on people using stores or creating stores using the existing Svelte stores. ( #6750 )
-
derived will now throw an error on falsy values instead of stores passed to it. ( #7947 )
-
type definitions for svelte/internal were removed to further discourage usage of those internal methods which are not public API. Most of these will likely change for Svelte 5
-
Removal of DOM nodes is now batched which slightly changes its order, which might affect the order of events fired if you're using a MutationObserver on these elements ( #8763 )
-
if you enhanced the global typings through the svelte.JSX namespace before, you need to migrate this to use the svelteHTML namespace. Similarly if you used the svelte.JSX namespace to use type definitions from it, you need to migrate those to use the types from svelte/elements instead. You can find more information about what to do here
Edit this page on GitHub llms.txt
previous next
Custom elements Svelte 5 migration guide
