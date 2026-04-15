# {#await ...} • Svelte Docs

Source: https://svelte.dev/docs/svelte/await
Fetched: 2026-04-15T18:23:01.727853+00:00

{#await ...} • Svelte Docs
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
# {#await ...}
## See also
-
Tutorial Basic Svelte Logic Await blocks
### On this page
-
{#await ...}
{# await expression}...{: then name}...{: catch name}...{/ await }
{# await expression}...{: then name}...{/ await }
{# await expression then name}...{/ await }
{# await expression catch name}...{/ await }
Await blocks allow you to branch on the three possible states of a Promise — pending, fulfilled or rejected.
{# await promise} <!-- promise is pending --> < p >waiting for the promise to resolve...</ p > {: then value} <!-- promise was fulfilled or not a Promise --> < p >The value is {value}</ p > {: catch error} <!-- promise was rejected --> < p >Something went wrong: { error .message}</ p > {/ await }
During server-side rendering, only the pending branch will be rendered.
If the provided expression is not a Promise , only the :then branch will be rendered, including during server-side rendering.
The catch block can be omitted if you don't need to render anything when the promise rejects (or no error is possible).
{# await promise} <!-- promise is pending --> < p >waiting for the promise to resolve...</ p > {: then value} <!-- promise was fulfilled --> < p >The value is {value}</ p > {/ await }
If you don't care about the pending state, you can also omit the initial block.
{# await promise then value} < p >The value is {value}</ p > {/ await }
Similarly, if you only want to show the error state, you can omit the then block.
{# await promise catch error} < p >The error is {error}</ p > {/ await }
You can use #await with import(...) to render components lazily:
{# await import ( './Component.svelte' ) then { default : Component }} < Component /> {/ await }
Edit this page on GitHub llms.txt
previous next
{#key ...} {#snippet ...}
