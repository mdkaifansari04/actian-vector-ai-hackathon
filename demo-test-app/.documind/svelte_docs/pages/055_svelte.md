# svelte • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte
Fetched: 2026-04-15T18:23:46.722968+00:00

svelte • Svelte Docs
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
# svelte
### On this page
-
svelte
-
SvelteComponent
-
SvelteComponentTyped
-
afterUpdate
-
beforeUpdate
-
createContext
-
createEventDispatcher
-
createRawSnippet
-
flushSync
-
fork
-
getAbortSignal
-
getAllContexts
-
getContext
-
hasContext
-
hydratable
-
hydrate
-
mount
-
onDestroy
-
onMount
-
setContext
-
settled
-
tick
-
unmount
-
untrack
-
Component
-
ComponentConstructorOptions
-
ComponentEvents
-
ComponentInternals
-
ComponentProps
-
ComponentType
-
EventDispatcher
-
Fork
-
MountOptions
-
Snippet
import { class SvelteComponent < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any >
This was the base class for Svelte components in Svelte 4. Svelte 5+ components
are completely different under the hood. For typing, use Component instead.
To instantiate components, use mount instead.
See migration guide for more info.
reference
SvelteComponent , class SvelteComponentTyped < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any >
@deprecated
Use Component instead. See migration guide for more information.
reference
SvelteComponentTyped , function afterUpdate ( fn : () => void ) : void
Schedules a callback to run immediately after the component has been updated.
The first time the callback runs will be after the initial onMount .
In runes mode use $effect instead.
@deprecated
Use $effect instead
reference
afterUpdate , function beforeUpdate ( fn : () => void ) : void
Schedules a callback to run immediately before the component is updated after any state change.
The first time the callback runs will be before the initial onMount .
In runes mode use $effect.pre instead.
@deprecated
Use $effect.pre instead
reference
beforeUpdate , function createContext < T >() : [() => T , (context : T ) => T ]
Returns a [get, set] pair of functions for working with context in a type-safe way.
get will throw an error if no parent component called set .
@since
5.40.0
reference
createContext , function createEventDispatcher < EventMap extends Record < string , any > = any >() : EventDispatcher < EventMap >
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
createEventDispatcher ,
function createRawSnippet < Params extends unknown []>( fn : ( ... params : Getters < Params >) => { render : () => string ; setup ?: (element : Element ) => void | (() => void ); }) : Snippet < Params >
Create a snippet programmatically
reference
createRawSnippet , function flushSync < T = void >(fn ?: (() => T ) | undefined ) : T
Synchronously flush any pending updates.
Returns void if no callback is provided, otherwise returns the result of calling the callback.
reference
flushSync , function fork ( fn : () => void ) : Fork
Creates a 'fork', in which state changes are evaluated but not applied to the DOM.
This is useful for speculatively loading data (for example) when you suspect that
the user is about to take some action.
Frameworks like SvelteKit can use this to preload data when the user touches or
hovers over a link, making any subsequent navigation feel instantaneous.
The fn parameter is a synchronous function that modifies some state. The
state changes will be reverted after the fork is initialised, then reapplied
if and when the fork is eventually committed.
When it becomes clear that a fork will not be committed (e.g. because the
user navigated elsewhere), it must be discarded to avoid leaking memory.
@since
5.42
reference
fork , function getAbortSignal () : AbortSignal
Returns an AbortSignal that aborts when the current derived or effect re-runs or is destroyed.
Must be called while a derived or effect is running.
< script > import { getAbortSignal } from 'svelte' ; let { id } = $ props (); async function getData (id) { const response = await fetch ( `/items/ ${ id } ` , { signal : getAbortSignal () }); return await response .json (); } const data = $ derived ( await getData (id)); </ script >
reference
getAbortSignal , function getAllContexts < T extends Map < any , any > = Map < any , any >>() : T
Retrieves the whole context map that belongs to the closest parent component.
Must be called during component initialisation. Useful, for example, if you
programmatically create a component and want to pass the existing context to it.
reference
getAllContexts , function getContext < T >(key : any ) : T
Retrieves the context that belongs to the closest parent component with the specified key .
Must be called during component initialisation.
createContext is a type-safe alternative.
reference
getContext , function hasContext (key : any ) : boolean
Checks whether a given key has been set in the context of a parent component.
Must be called during component initialisation.
reference
hasContext , function hydratable < T >(key : string , fn : () => T ) : T
reference
hydratable ,
function hydrate < Props extends Record < string , any > , Exports extends Record < string , any >>(component : ComponentType < SvelteComponent < Props >> | Component < Props , Exports , any > , options : {} extends Props ? { target : Document | Element | ShadowRoot ; props ?: Props ; events ?: Record < string , (e : any ) => any >; context ?: Map < any , any >; intro ?: boolean ; recover ?: boolean ; transformError ?: (error : unknown ) => unknown ; } : { target : Document | Element | ShadowRoot ; props : Props ; events ?: Record < string , (e : any ) => any >; context ?: Map < any , any >; intro ?: boolean ; recover ?: boolean ; transformError ?: (error : unknown ) => unknown ; }) : Exports
Hydrates a component on the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component
reference
hydrate , function mount < Props extends Record < string , any > , Exports extends Record < string , any >>(component : ComponentType < SvelteComponent < Props >> | Component < Props , Exports , any > , options : MountOptions < Props >) : Exports
Mounts a component to the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component.
Transitions will play during the initial render unless the intro option is set to false .
reference
mount , function onDestroy ( fn : () => any ) : void
Schedules a callback to run immediately before the component is unmounted.
Out of onMount , beforeUpdate , afterUpdate and onDestroy , this is the
only one that runs inside a server-side component.
reference
onDestroy , function onMount < T >( fn : () => NotFunction < T > | Promise < NotFunction < T >> | (() => any )) : void
onMount , like $effect , schedules a function to run as soon as the component has been mounted to the DOM.
Unlike $effect , the provided function only runs once.
It must be called during the component's initialisation (but doesn't need to live inside the component;
it can be called from an external module). If a function is returned synchronously from onMount ,
it will be called when the component is unmounted.
onMount functions do not run during server-side rendering .
reference
onMount , function setContext < T >(key : any , context : T ) : T
Associates an arbitrary context object with the current component and the specified key and returns that object. The context is then available to children of the component
(including slotted content) with getContext .
Like lifecycle functions, this must be called during component initialisation.
createContext is a type-safe alternative.
reference
setContext , function settled () : Promise < void >
Returns a promise that resolves once any state changes, and asynchronous work resulting from them,
have resolved and the DOM has been updated
@since
5.36
reference
settled , function tick () : Promise < void >
Returns a promise that resolves once any pending state changes have been applied.
reference
tick ,
function unmount (component : Record < string , any > , options ?: { outro ?: boolean ; } | undefined ) : Promise < void >
Unmounts a component that was previously mounted using mount or hydrate .
Since 5.13.0, if options.outro is true , transitions will play before the component is removed from the DOM.
Returns a Promise that resolves after transitions have completed if options.outro is true, or immediately otherwise (prior to 5.13.0, returns void ).
import { mount , unmount } from 'svelte' ; import App from './App.svelte' ; const app = mount (App , { target : document .body }); // later... unmount (app , { outro : true });
reference
unmount , function untrack < T >( fn : () => T ) : T
When used inside a $derived or $effect ,
any state read inside fn will not be treated as a dependency.
$effect (() => { // this will run when `data` changes, but not when `time` changes save (data , { timestamp : untrack (() => time) }); });
reference
untrack } from 'svelte' ;
## SvelteComponent
This was the base class for Svelte components in Svelte 4. Svelte 5+ components
are completely different under the hood. For typing, use Component instead.
To instantiate components, use mount instead.
See migration guide for more info.
class SvelteComponent < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any > { … }
static element ?: typeof HTMLElement;
The custom element version of the component. Only present if compiled with the customElement compiler option
[prop: string]: any;
constructor (options: ComponentConstructorOptions < Properties < Props , Slots >> );
-
deprecated This constructor only exists when using the asClassComponent compatibility helper, which
is a stop-gap solution. Migrate towards using mount instead. See migration guide for more info.
$destroy (): void ;
-
deprecated This method only exists when using one of the legacy compatibility helpers, which
is a stop-gap solution. See migration guide for more info.
$on < K extends Extract < keyof Events , string >> ( type: K , callback: (e : Events [ K ]) => void ): () => void ;
-
deprecated This method only exists when using one of the legacy compatibility helpers, which
is a stop-gap solution. See migration guide for more info.
$set (props: Partial < Props > ): void ;
-
deprecated This method only exists when using one of the legacy compatibility helpers, which
is a stop-gap solution. See migration guide for more info.
## SvelteComponentTyped
Use Component instead. See migration guide for more information.
class SvelteComponentTyped < Props extends Record < string , any > = Record < string , any > , Events extends Record < string , any > = any , Slots extends Record < string , any > = any > extends SvelteComponent < Props , Events , Slots > {}
## afterUpdate
Use $effect instead
Schedules a callback to run immediately after the component has been updated.
The first time the callback runs will be after the initial onMount .
In runes mode use $effect instead.
function afterUpdate ( fn : () => void ) : void ;
## beforeUpdate
Use $effect.pre instead
Schedules a callback to run immediately before the component is updated after any state change.
The first time the callback runs will be before the initial onMount .
In runes mode use $effect.pre instead.
function beforeUpdate ( fn : () => void ) : void ;
## createContext
Available since 5.40.0
Returns a [get, set] pair of functions for working with context in a type-safe way.
get will throw an error if no parent component called set .
function createContext < T >() : [() => T , (context : T ) => T ];
## createEventDispatcher
Use callback props and/or the $host() rune instead — see migration guide
Creates an event dispatcher that can be used to dispatch component events .
Event dispatchers are functions that can take two arguments: name and detail .
Component events created with createEventDispatcher create a CustomEvent .
These events do not bubble .
The detail argument corresponds to the CustomEvent.detail property and can contain any type of data.
The event dispatcher can be typed to narrow the allowed event names and the type of the detail argument:
const const dispatch : any dispatch = createEventDispatcher <{ loaded : null loaded : null ; // does not take a detail argument change : string change : string ; // takes a detail argument of type string, which is required optional : number | null optional : number | null ; // takes an optional detail argument of type number }>();
function createEventDispatcher < EventMap extends Record < string , any > = any >() : EventDispatcher < EventMap >;
## createRawSnippet
Create a snippet programmatically
function createRawSnippet < Params extends unknown []>( fn : ( ... params : Getters < Params >) => { render : () => string ; setup ?: (element : Element ) => void | (() => void ); } ) : Snippet < Params >;
## flushSync
Synchronously flush any pending updates.
Returns void if no callback is provided, otherwise returns the result of calling the callback.
function flushSync < T = void >(fn ?: (() => T ) | undefined ) : T ;
## fork
Available since 5.42
Creates a 'fork', in which state changes are evaluated but not applied to the DOM.
This is useful for speculatively loading data (for example) when you suspect that
the user is about to take some action.
Frameworks like SvelteKit can use this to preload data when the user touches or
hovers over a link, making any subsequent navigation feel instantaneous.
The fn parameter is a synchronous function that modifies some state. The
state changes will be reverted after the fork is initialised, then reapplied
if and when the fork is eventually committed.
When it becomes clear that a fork will not be committed (e.g. because the
user navigated elsewhere), it must be discarded to avoid leaking memory.
function fork ( fn : () => void ) : Fork ;
## getAbortSignal
Returns an AbortSignal that aborts when the current derived or effect re-runs or is destroyed.
Must be called while a derived or effect is running.
< script > import { getAbortSignal } from 'svelte' ; let { id } = $ props (); async function getData (id) { const response = await fetch ( `/items/ ${ id } ` , { signal : getAbortSignal () }); return await response .json (); } const data = $ derived ( await getData (id)); </ script >
function getAbortSignal () : AbortSignal ;
## getAllContexts
Retrieves the whole context map that belongs to the closest parent component.
Must be called during component initialisation. Useful, for example, if you
programmatically create a component and want to pass the existing context to it.
function getAllContexts < T extends Map < any , any > = Map < any , any > >() : T ;
## getContext
Retrieves the context that belongs to the closest parent component with the specified key .
Must be called during component initialisation.
createContext is a type-safe alternative.
function getContext < T >(key : any ) : T ;
## hasContext
Checks whether a given key has been set in the context of a parent component.
Must be called during component initialisation.
function hasContext (key : any ) : boolean ;
## hydratable
function hydratable < T >(key : string , fn : () => T ) : T ;
## hydrate
Hydrates a component on the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component
function hydrate < Props extends Record < string , any > , Exports extends Record < string , any > >( component : | ComponentType < SvelteComponent < Props >> | Component < Props , Exports , any > , options : {} extends Props ? { target : Document | Element | ShadowRoot ; props ?: Props ; events ?: Record < string , (e : any ) => any >; context ?: Map < any , any >; intro ?: boolean ; recover ?: boolean ; transformError ?: (error : unknown ) => unknown ; } : { target : Document | Element | ShadowRoot ; props : Props ; events ?: Record < string , (e : any ) => any >; context ?: Map < any , any >; intro ?: boolean ; recover ?: boolean ; transformError ?: (error : unknown ) => unknown ; } ) : Exports ;
## mount
Mounts a component to the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component.
Transitions will play during the initial render unless the intro option is set to false .
function mount < Props extends Record < string , any > , Exports extends Record < string , any > >( component : | ComponentType < SvelteComponent < Props >> | Component < Props , Exports , any > , options : MountOptions < Props > ) : Exports ;
## onDestroy
Schedules a callback to run immediately before the component is unmounted.
Out of onMount , beforeUpdate , afterUpdate and onDestroy , this is the
only one that runs inside a server-side component.
function onDestroy ( fn : () => any ) : void ;
## onMount
onMount , like $effect , schedules a function to run as soon as the component has been mounted to the DOM.
Unlike $effect , the provided function only runs once.
It must be called during the component's initialisation (but doesn't need to live inside the component;
it can be called from an external module). If a function is returned synchronously from onMount ,
it will be called when the component is unmounted.
onMount functions do not run during server-side rendering .
function onMount < T >( fn : () => | NotFunction < T > | Promise < NotFunction < T >> | (() => any ) ) : void ;
## setContext
Associates an arbitrary context object with the current component and the specified key and returns that object. The context is then available to children of the component
(including slotted content) with getContext .
Like lifecycle functions, this must be called during component initialisation.
createContext is a type-safe alternative.
function setContext < T >(key : any , context : T ) : T ;
## settled
Available since 5.36
Returns a promise that resolves once any state changes, and asynchronous work resulting from them,
have resolved and the DOM has been updated
function settled () : Promise < void >;
## tick
Returns a promise that resolves once any pending state changes have been applied.
function tick () : Promise < void >;
## unmount
Unmounts a component that was previously mounted using mount or hydrate .
Since 5.13.0, if options.outro is true , transitions will play before the component is removed from the DOM.
Returns a Promise that resolves after transitions have completed if options.outro is true, or immediately otherwise (prior to 5.13.0, returns void ).
import { function mount < Props extends Record < string , any > , Exports extends Record < string , any >>(component : ComponentType < SvelteComponent < Props >> | Component < Props , Exports , any > , options : MountOptions < Props >) : Exports
Mounts a component to the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component.
Transitions will play during the initial render unless the intro option is set to false .
reference
mount ,
function unmount (component : Record < string , any > , options ?: { outro ?: boolean ; } | undefined ) : Promise < void >
Unmounts a component that was previously mounted using mount or hydrate .
Since 5.13.0, if options.outro is true , transitions will play before the component is removed from the DOM.
Returns a Promise that resolves after transitions have completed if options.outro is true, or immediately otherwise (prior to 5.13.0, returns void ).
import { mount , unmount } from 'svelte' ; import App from './App.svelte' ; const app = mount (App , { target : document .body }); // later... unmount (app , { outro : true });
reference
unmount } from 'svelte' ; import
type App = SvelteComponent < Record < string , any > , any , any > const App : LegacyComponentType
App from './App.svelte' ; const
const app : { $on ? (type : string , callback : (e : any ) => void ) : () => void ; $set ? (props : Partial < Record < string , any >>) : void ; } & Record < string , any >
app =
mount < Record < string , any > , { $on ? (type : string , callback : (e : any ) => void ) : () => void ; $set ? (props : Partial < Record < string , any >>) : void ; } & Record < string , any >> (component : ComponentType < SvelteComponent < Record < string , any > , any , any >> | Component < Record < string , any > , { $on ? (type : string , callback : (e : any ) => void ) : () => void ; $set ? (props : Partial < Record < string , any >>) : void ; } & Record < string , any > , any > , options : MountOptions <...>) : { $on ? (type : string , callback : (e : any ) => void ) : () => void ; $set ? (props : Partial < Record < string , any >>) : void ; } & Record <...>
Mounts a component to the given target and returns the exports and potentially the props (if compiled with accessors: true ) of the component.
Transitions will play during the initial render unless the intro option is set to false .
reference
mount ( const App : LegacyComponentType App , { target : Document | Element | ShadowRoot
Target element where the component will be mounted.
target : var document : Document
window.document returns a reference to the document contained in the window.
MDN Reference
document . Document .body: HTMLElement
The Document.body property represents the null if no such element exists.
MDN Reference
body }); // later...
function unmount (component : Record < string , any > , options ?: { outro ?: boolean ; } | undefined ) : Promise < void >
Unmounts a component that was previously mounted using mount or hydrate .
Since 5.13.0, if options.outro is true , transitions will play before the component is removed from the DOM.
Returns a Promise that resolves after transitions have completed if options.outro is true, or immediately otherwise (prior to 5.13.0, returns void ).
import { mount , unmount } from 'svelte' ; import App from './App.svelte' ; const app = mount (App , { target : document .body }); // later... unmount (app , { outro : true });
reference
unmount (
const app : { $on ? (type : string , callback : (e : any ) => void ) : () => void ; $set ? (props : Partial < Record < string , any >>) : void ; } & Record < string , any >
app , { outro ?: boolean | undefined outro : true });
function unmount ( component : Record < string , any > , options ?: | { outro ?: boolean ; } | undefined ) : Promise < void >;
## untrack
When used inside a $derived or $effect ,
any state read inside fn will not be treated as a dependency.
function $effect ( fn : () => void | (() => void )) : void namespace $effect
Runs code when a component is mounted to the DOM, and then whenever its dependencies change, i.e. $state or $derived values.
The timing of the execution is after the DOM has been updated.
Example:
$effect (() => console .log ( 'The count is now ' + count));
If you return a function from the effect, it will be called right before the effect is run again, or when the component is unmounted.
Does not run during server-side rendering.
@see
{@link https://svelte.dev/docs/svelte/$effect Documentation}
@param
fn The function to execute
$effect (() => { // this will run when `data` changes, but not when `time` changes save ( data , { timestamp : any timestamp : untrack (() => time ) }); });
function untrack < T >( fn : () => T ) : T ;
## Component
Can be used to create strongly typed Svelte components.
#### Example:
You have component library on npm called component-library , from which
you export a component called MyComponent . For Svelte+TypeScript users,
you want to provide typings. Therefore you create a index.d.ts :
import type { Component } from 'svelte' ; export declare const MyComponent : Component <{ foo : string }> {}
Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:
< script lang = "ts" > import { MyComponent } from "component-library" ; </ script > < MyComponent foo = { 'bar' } />
interface Component < Props extends Record < string , any > = {} , Exports extends Record < string , any > = {} , Bindings extends keyof Props | '' = string > { … }
( this : void , internals: ComponentInternals , props: Props ): { /** * @deprecated This method only exists when using one of the legacy compatibility helpers, which * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes) * for more info. */ $on ? (type : string , callback : (e : any ) => void ) : () => void ; /** * @deprecated This method only exists when using one of the legacy compatibility helpers, which * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes) * for more info. */ $set ? (props : Partial < Props >) : void ; } & Exports;
-
internal An internal object used by Svelte. Do not use or modify.
-
props The props passed to the component.
element ?: typeof HTMLElement;
The custom element version of the component. Only present if compiled with the customElement compiler option
## ComponentConstructorOptions
In Svelte 4, components are classes. In Svelte 5, they are functions.
Use mount instead to instantiate components.
See migration guide for more info.
interface ComponentConstructorOptions < Props extends Record < string , any > = Record < string , any > > { … }
target : Element | Document | ShadowRoot;
anchor ?: Element;
props ?: Props;
context ?: Map < any , any > ;
hydrate ?: boolean;
intro ?: boolean;
recover ?: boolean;
sync ?: boolean;
idPrefix ?: string;
$$inline ?: boolean;
transformError ?: (error : unknown ) => unknown;
## ComponentEvents
The new Component type does not have a dedicated Events type. Use ComponentProps instead.
type ComponentEvents < Comp extends SvelteComponent > = Comp extends SvelteComponent < any , infer Events > ? Events : never ;
## ComponentInternals
Internal implementation details that vary between environments
type ComponentInternals = Branded <{} , 'ComponentInternals' >;
## ComponentProps
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const props : ComponentProps < typeof MyComponent> = { foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
reference
ComponentProps } from 'svelte' ; import
type MyComponent = SvelteComponent < Record < string , any > , any , any > const MyComponent : LegacyComponentType
MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const const props : Record < string , any > props : type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const props : ComponentProps < typeof MyComponent> = { foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
reference
ComponentProps < typeof const MyComponent : LegacyComponentType MyComponent > = { foo : string foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { interface Component < Props extends Record < string , any > = {} , Exports extends Record < string , any > = {} , Bindings extends keyof Props | "" = string >
Can be used to create strongly typed Svelte components.
#### Example:
You have component library on npm called component-library , from which
you export a component called MyComponent . For Svelte+TypeScript users,
you want to provide typings. Therefore you create a index.d.ts :
import type { Component } from 'svelte' ; export declare const MyComponent : Component <{ foo : string }> {}
Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:
< script lang = "ts" > import { MyComponent } from "component-library" ; </ script > < MyComponent foo = { 'bar' } />
Component , type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const props : ComponentProps < typeof MyComponent> = { foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
ComponentProps } from 'svelte' ; import
type MyComponent = SvelteComponent < Record < string , any > , any , any > const MyComponent : LegacyComponentType
MyComponent from './MyComponent.svelte' ; function function withProps < TComponent extends Component < any >>(component : TComponent , props : ComponentProps < TComponent >) : void withProps < function (type parameter) TComponent in withProps < TComponent extends Component < any >>(component : TComponent , props : ComponentProps < TComponent >) : void TComponent extends interface Component < Props extends Record < string , any > = {} , Exports extends Record < string , any > = {} , Bindings extends keyof Props | "" = string >
Can be used to create strongly typed Svelte components.
#### Example:
You have component library on npm called component-library , from which
you export a component called MyComponent . For Svelte+TypeScript users,
you want to provide typings. Therefore you create a index.d.ts :
import type { Component } from 'svelte' ; export declare const MyComponent : Component <{ foo : string }> {}
Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:
< script lang = "ts" > import { MyComponent } from "component-library" ; </ script > < MyComponent foo = { 'bar' } />
Component < any >>( component : TComponent extends Component < any > component : function (type parameter) TComponent in withProps < TComponent extends Component < any >>(component : TComponent , props : ComponentProps < TComponent >) : void TComponent , props : ComponentProps < TComponent > props : type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const props : ComponentProps < typeof MyComponent> = { foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
reference
ComponentProps } from 'svelte' ; import
type MyComponent = SvelteComponent < Record < string , any > , any , any > const MyComponent : LegacyComponentType
MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const const props : Record < string , any > props : type ComponentProps < Comp extends SvelteComponent | Component < any , any >> = Comp extends SvelteComponent < infer Props extends Record < string , any > , any , any > ? Props : Comp extends Component < infer Props extends Record < string , any > , any , string > ? Props : never
Convenience type to get the props the given component expects.
Example: Ensure a variable contains the props expected by MyComponent :
import type { ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; // Errors if these aren't the correct props expected by MyComponent. const props : ComponentProps < typeof MyComponent> = { foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
reference
ComponentProps < typeof const MyComponent : LegacyComponentType MyComponent > = { foo : string foo : 'bar' };
In Svelte 4, you would do ComponentProps<MyComponent> because MyComponent was a class.
Example: A generic function that accepts some component and infers the type of its props:
import type { Component , ComponentProps } from 'svelte' ; import MyComponent from './MyComponent.svelte' ; function withProps < TComponent extends Component < any >>( component : TComponent , props : ComponentProps < TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. withProps (MyComponent , { foo : 'bar' });
ComponentProps < function (type parameter) TComponent in withProps < TComponent extends Component < any >>(component : TComponent , props : ComponentProps < TComponent >) : void TComponent > ) {}; // Errors if the second argument is not the correct props expected by the component in the first argument. function withProps < LegacyComponentType >(component : LegacyComponentType , props : Record < string , any >) : void withProps ( const MyComponent : LegacyComponentType MyComponent , { foo : string foo : 'bar' });
type ComponentProps < Comp extends SvelteComponent | Component < any , any > > = Comp extends SvelteComponent < infer Props > ? Props : Comp extends Component < infer Props , any > ? Props : never ;
## ComponentType
This type is obsolete when working with the new Component type.
type ComponentType < Comp extends SvelteComponent = SvelteComponent > = ( new ( options : ComponentConstructorOptions < Comp extends SvelteComponent < infer Props > ? Props : Record < string , any > > ) => Comp ) & { /** The custom element version of the component. Only present if compiled with the `customElement` compiler option */ element ?: typeof HTMLElement; };
## EventDispatcher
interface EventDispatcher < EventMap extends Record < string , any > > { … }
< Type extends keyof EventMap > ( ... args: null extends EventMap[Type] ? [type: Type , parameter ?: EventMap[Type] | null | undefined , options ?: DispatchOptions] : undefined extends EventMap[Type] ? [type: Type , parameter ?: EventMap[Type] | null | undefined , options ?: DispatchOptions] : [type: Type , parameter: EventMap[Type] , options ?: DispatchOptions] ): boolean;
## Fork
Available since 5.42
Represents work that is happening off-screen, such as data being preloaded
in anticipation of the user navigating
interface Fork { … }
commit (): Promise <void> ;
Commit the fork. The promise will resolve once the state change has been applied
discard (): void ;
Discard the fork
## MountOptions
Defines the options accepted by the mount() function.
type MountOptions < Props extends Record < string , any > = Record < string , any > > = { /** * Target element where the component will be mounted. */ target : Document | Element | ShadowRoot ; /** * Optional node inside `target`. When specified, it is used to render the component immediately before it. */ anchor ?: Node ; /** * Allows the specification of events. * @deprecated Use callback props instead. */ events ?: Record < string , (e : any ) => any >; /** * Can be accessed via `getContext()` at the component level. */ context ?: Map < any , any >; /** * Whether or not to play transitions on initial render. * @default true */ intro ?: boolean ; /** * A function that transforms errors caught by error boundaries before they are passed to the `failed` snippet. * Defaults to the identity function. */ transformError ?: ( error : unknown ) => unknown | Promise < unknown >; } & ({} extends Props ? { /** * Component properties. */ props ?: Props ; } : { /** * Component properties. */ props : Props ; });
## Snippet
The type of a #snippet block. You can use it to (for example) express that your component expects a snippet of a certain type:
let {
let banner : Snippet <[{ text : string ; }]>
banner } : {
banner : Snippet < [{ text : string; }] >
banner : type Snippet = /*unresolved*/ any Snippet <[{ text : string text : string }]> } =
function $props () : any namespace $props
Declares the props that a component accepts. Example:
let { optionalProp = 42 , requiredProp , bindableProp = $bindable () } : { optionalProp ?: number ; requiredProps : string ; bindableProp : boolean } = $props ();
@see
{@link https://svelte.dev/docs/svelte/$props Documentation}
$props ();
You can only call a snippet through the {@render ...} tag.
See the snippet documentation for more info.
interface Snippet < Parameters extends unknown [] = []> { … }
( this : void , // this conditional allows tuples but not arrays. Arrays would indicate a // rest parameter type, which is not supported. If rest parameters are added // in the future, the condition can be removed. ... args: number extends Parameters[ 'length' ] ? never : Parameters ): { '{@render ...} must be called with a Snippet' : "import type { Snippet } from 'svelte'" ; } & typeof SnippetReturn;
Edit this page on GitHub llms.txt
previous next
Frequently asked questions svelte/action
