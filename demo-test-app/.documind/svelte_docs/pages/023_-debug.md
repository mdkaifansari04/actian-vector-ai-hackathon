# {@debug ...} • Svelte Docs

Source: https://svelte.dev/docs/svelte/@debug
Fetched: 2026-04-15T18:23:08.621488+00:00

{@debug ...} • Svelte Docs
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
# {@debug ...}
### On this page
-
{@debug ...}
The {@debug ...} tag offers an alternative to console.log(...) . It logs the values of specific variables whenever they change, and pauses code execution if you have devtools open.
< script > let user = { firstname : 'Ada' , lastname : 'Lovelace' }; </ script > {@ debug user} < h1 >Hello { user .firstname}!</ h1 >
{@debug ...} accepts a comma-separated list of variable names (not arbitrary expressions).
<!-- Compiles --> {@ debug user} {@ debug user1 , user2 , user3} <!-- WON'T compile --> {@ debug user.firstname} {@ debug myArray[0]} {@ debug !isReady} {@ debug typeof user === 'object'}
The {@debug} tag without any arguments will insert a debugger statement that gets triggered when any state changes, as opposed to the specified variables.
Edit this page on GitHub llms.txt
previous next
{@const ...} bind:
