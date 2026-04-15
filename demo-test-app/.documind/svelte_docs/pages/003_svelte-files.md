# .svelte files • Svelte Docs

Source: https://svelte.dev/docs/svelte/svelte-files
Fetched: 2026-04-15T18:22:46.927062+00:00

.svelte files • Svelte Docs
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
Svelte Introduction
# .svelte files
### On this page
-
.svelte files
-
<script>
-
<script module>
-
<style>
Components are the building blocks of Svelte applications. They are written into .svelte files, using a superset of HTML.
All three sections — script, styles and markup — are optional.
MyComponent
< script module > // module-level logic goes here // (you will rarely use this) </ script > < script > // instance-level logic goes here </ script > <!-- markup (zero or more items) goes here --> < style > /* styles go here */ </ style >
< script module > // module-level logic goes here // (you will rarely use this) </ script > < script lang = "ts" > // instance-level logic goes here </ script > <!-- markup (zero or more items) goes here --> < style > /* styles go here */ </ style >
## <script>
A <script> block contains JavaScript (or TypeScript, when adding the lang="ts" attribute) that runs when a component instance is created. Variables declared (or imported) at the top level can be referenced in the component's markup.
In addition to normal JavaScript, you can use runes to declare component props and add reactivity to your component. Runes are covered in the next section.
## <script module>
A <script> tag with a module attribute runs once when the module first evaluates, rather than for each component instance. Variables declared in this block can be referenced elsewhere in the component, but not vice versa.
< script module > let total = 0 ; </ script > < script > total += 1 ; console .log ( `instantiated ${ total } times` ); </ script >
You can export bindings from this block, and they will become exports of the compiled module. You cannot export default , since the default export is the component itself.
If you are using TypeScript and import such exports from a module block into a .ts file, make sure to have your editor setup so that TypeScript knows about them. This is the case for our VS Code extension and the IntelliJ plugin, but in other cases you might need to setup our TypeScript editor plugin .
Legacy mode
In Svelte 4, this script tag was created using <script context="module">
## <style>
CSS inside a <style> block will be scoped to that component.
< style > p { /* this will only affect <p> elements in this component */ color : burlywood ; } </ style >
For more information, head to the section on styling .
Edit this page on GitHub llms.txt
previous next
Getting started .svelte.js and .svelte.ts files
