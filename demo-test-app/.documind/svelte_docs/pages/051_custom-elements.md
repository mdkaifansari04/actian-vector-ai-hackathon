# Custom elements • Svelte Docs

Source: https://svelte.dev/docs/svelte/custom-elements
Fetched: 2026-04-15T18:23:39.787760+00:00

Custom elements • Svelte Docs
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
# Custom elements
### On this page
-
Custom elements
-
Component lifecycle
-
Component options
-
Caveats and limitations
Svelte components can also be compiled to custom elements (aka web components) using the customElement: true compiler option. You should specify a tag name for the component using the <svelte:options> element . Within the custom element you can access the host element via the $host rune.
< svelte : options customElement = "my-element" /> < script > let { name = 'world' } = $ props (); </ script > < h1 >Hello {name}!</ h1 > < slot />
You can leave out the tag name for any of your inner components which you don't want to expose and use them like regular Svelte components. Consumers of the component can still name it afterwards if needed, using the static element property which contains the custom element constructor and which is available when the customElement compiler option is true .
import
type MyElement = SvelteComponent < Record < string , any > , any , any > const MyElement : LegacyComponentType
MyElement from './MyElement.svelte' ; var customElements : CustomElementRegistry
The customElements read-only property of the Window interface returns a reference to the CustomElementRegistry object, which can be used to register new custom elements and get information about previously registered custom elements.
MDN Reference
customElements . CustomElementRegistry .define (name: string , constructor: CustomElementConstructor , options ?: ElementDefinitionOptions): void
The define() method of the CustomElementRegistry interface adds a definition for a custom element to the custom element registry, mapping its name to the constructor which will be used to create it.
MDN Reference
define ( 'my-element' , const MyElement : LegacyComponentType MyElement . element );
Once a custom element has been defined, it can be used as a regular DOM element:
module document var document : Document
window.document returns a reference to the document contained in the window.
MDN Reference
document . Document .body: HTMLElement
The Document.body property represents the null if no such element exists.
MDN Reference
body . Element .innerHTML: string
The innerHTML property of the Element interface gets or sets the HTML or XML markup contained within the element.
MDN Reference
innerHTML = ` <my-element> <p>This is some slotted content</p> </my-element> ` ;
Any props are exposed as properties of the DOM element (as well as being readable/writable as attributes, where possible).
const
module el const el : Element | null
el = var document : Document
window.document returns a reference to the document contained in the window.
MDN Reference
document . ParentNode .querySelector < Element >(selectors: string): Element | null ( + 4 overloads)
Returns the first element that is a descendant of node that matches selectors.
MDN Reference
querySelector ( 'my-element' ); // get the current value of the 'name' prop var console : Console
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
log (
module el const el : Element | null
el . name ); // set a new value, updating the shadow DOM
module el const el : Element | null
el . name = 'everybody' ;
Note that you need to list out all properties explicitly, i.e. doing let props = $props() without declaring props in the component options means that Svelte can't know which props to expose as properties on the DOM element.
## Component lifecycle
Custom elements are created from Svelte components using a wrapper approach. This means the inner Svelte component has no knowledge that it is a custom element. The custom element wrapper takes care of handling its lifecycle appropriately.
When a custom element is created, the Svelte component it wraps is not created right away. It is only created in the next tick after the connectedCallback is invoked. Properties assigned to the custom element before it is inserted into the DOM are temporarily saved and then set on component creation, so their values are not lost. The same does not work for invoking exported functions on the custom element though, they are only available after the element has mounted. If you need to invoke functions before component creation, you can work around it by using the extend option .
When a custom element written with Svelte is created or updated, the shadow DOM will reflect the value in the next tick, not immediately. This way updates can be batched, and DOM moves which temporarily (but synchronously) detach the element from the DOM don't lead to unmounting the inner component.
The inner Svelte component is destroyed in the next tick after the disconnectedCallback is invoked.
## Component options
When constructing a custom element, you can tailor several aspects by defining customElement as an object within <svelte:options> since Svelte 4. This object may contain the following properties:
-
tag: string : an optional tag property for the custom element's name. If set, a custom element with this tag name will be defined with the document's customElements registry upon importing this component.
-
shadow : an optional property to modify shadow root properties. It accepts the following values:
-
"none" : No shadow root is created. Note that styles are then no longer encapsulated, and you can't use slots.
-
"open" : Shadow root is created with the mode: "open" option.
-
ShadowRootInit : You can pass a settings object that will be passed to attachShadow() when shadow root is created.
-
props : an optional property to modify certain details and behaviors of your component's properties. It offers the following settings:
-
attribute: string : To update a custom element's prop, you have two alternatives: either set the property on the custom element's reference as illustrated above or use an HTML attribute. For the latter, the default attribute name is the lowercase property name. Modify this by assigning attribute: "<desired name>" .
-
reflect: boolean : By default, updated prop values do not reflect back to the DOM. To enable this behavior, set reflect: true .
-
type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object' : While converting an attribute value to a prop value and reflecting it back, the prop value is assumed to be a String by default. This may not always be accurate. For instance, for a number type, define it using type: "Number" You don't need to list all properties, those not listed will use the default settings.
-
extend : an optional property which expects a function as its argument. It is passed the custom element class generated by Svelte and expects you to return a custom element class. This comes in handy if you have very specific requirements to the life cycle of the custom element or want to enhance the class to for example use ElementInternals for better HTML form integration.
< svelte : options customElement = {{ tag : 'custom-element' , shadow : { mode : import . meta . env . DEV ? 'open' : 'closed' , clonable : true , // ... } , props : { name : { reflect : true , type : 'Number' , attribute : 'element-index' } } , extend : (customElementConstructor) => { // Extend the class so we can let it participate in HTML forms return class extends customElementConstructor { static formAssociated = true ; constructor () { super (); this .attachedInternals = this .attachInternals (); } // Add the function here, not below in the component so that // it's always available, not just when the inner Svelte component // is mounted randomIndex () { this .elementIndex = Math .random (); } }; } }} /> < script > let { elementIndex , attachedInternals } = $ props (); // ... function check () { attachedInternals .checkValidity (); } </ script > ...
While Typescript is supported in the extend function, it is subject to limitations: you need to set lang="ts" on one of the scripts AND you can only use erasable syntax in it. They are not processed by script preprocessors.
## Caveats and limitations
Custom elements can be a useful way to package components for consumption in a non-Svelte app, as they will work with vanilla HTML and JavaScript as well as most frameworks . There are, however, some important differences to be aware of:
-
Styles are encapsulated , rather than merely scoped (unless you set shadow: "none" ). This means that any non-component styles (such as you might have in a global.css file) will not apply to the custom element, including styles with the :global(...) modifier
-
Instead of being extracted out as a separate .css file, styles are inlined into the component as a JavaScript string
-
Custom elements are not generally suitable for server-side rendering, as the shadow DOM is invisible until JavaScript loads
-
In Svelte, slotted content renders lazily . In the DOM, it renders eagerly . In other words, it will always be created even if the component's <slot> element is inside an {#if ...} block. Similarly, including a <slot> in an {#each ...} block will not cause the slotted content to be rendered multiple times
-
The deprecated let: directive has no effect, because custom elements do not have a way to pass data to the parent component that fills the slot
-
Polyfills are required to support older browsers
-
You can use Svelte's context feature between regular Svelte components within a custom element, but you can't use them across custom elements. In other words, you can't use setContext on a parent custom element and read that with getContext in a child custom element.
-
Don't declare properties or attributes starting with on , as their usage will be interpreted as an event listener. In other words, Svelte treats <custom-element oneworld={true}></custom-element> as customElement.addEventListener('eworld', true) (and not as customElement.oneworld = true )
Edit this page on GitHub llms.txt
previous next
TypeScript Svelte 4 migration guide
