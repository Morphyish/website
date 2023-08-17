---
slug: 'svelte-event-handling'
title: 'Svelte event handling'
authors: [morphyish]
tags: [svelte]
---

Event handling is an important part of any Front End framework.
They are the bread and butter of user interactions.

While you need to listen to native events, such as scrolling, pointer events, keyboard events, etc...
You also need to consider custom events that tie together your components.

Props go down, events go up.

I recently started working on a component library with `Svelte`,
and struggled quite a bit with event handling, event forwarding to be precise.

<!--truncate-->

## The good

So. How are events handled in `Svelte` ?

### Native events

The syntax is fairly simple, and close enough to vanilla JS.

```html
<button on:click={handleClick}>CLICK ME</button>
```

You have a directive `on`, followed by the `eventname`.
You can also add `modifiers` to that event by adding a pipe `|` after the event name. Modifiers can be chained.

```html
<button on:click|preventDefault|stopPropagation={handleClick}>CLICK ME</button>
```

That gives us an easy to remember, and use, syntax `on:eventname|modifiers`.

If you want to know more, you can find everything about it in the [documentation](https://svelte.dev/docs#on_element_event).

### Custom events

That's great, you can handle native events fairly easily with a great syntax, and modifiers are really handy.

But what about custom events ?

Sometimes you need to create your own events to communicate between components.

If you are familiar with `React`, you have probably done this by passing a `function` as a `prop`.

```javascript
// HOC.jsx
export function HOC() {
    const handleEvent = () => null

    return <Button onMyEvent={handleEvent} />
}

// Button.jsx
export function Button({ onMyEvent }) {
    return <button onClick={onMyEvent}>CLICK ME</button>
}
```

`Angular` uses `EventEmitter` with the `(myEvent)` syntax,
and `Vue3` uses `this.$emit` with an `@my-event` syntax which is somewhat similar to `Angular` I guess ?.

Anyway you get the idea. The takeaway here, is that the syntax to handle custom events is similar to the one for native events.
And `Svelte` is no different.

You can listen to custom events as easily as native events, with the same syntax.

```html
<Button on:myEvent={handleEvent} />
```

What is different is __how__ we create this custom event.

In this regard, `Svelte` is a lot more similar to `Angular` or `Vue3` than `React`.

The Child component emits the event, which is then received by the parent and acted upon.
While with `React`, the parent passes around some function to the child which then calls it.

There's still a major difference, we need to make our own `event dispatcher`.
We don't have a ready to use `EventEmitter` or `this.$emit` here.

That makes sense with `Svelte` design, if you are not using custom events, then it won't be bundled.

Thankfully, we are still given a method to create it. So it's pretty easy.

```html
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>
```

The `dispatch` method takes 2 arguments.
The first one is the event `name`.
The second one is the `detail`, which is the custom data we want to send through the event.

```html
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button on:click="{() => dispatch('myEvent', 'detail value')}">CLICK ME</button>
```

Now we just have to make good use of it in the parent.

```html
<Button on:myEvent={event => console.log(event.detail)} />
```

Well, that's nice and all, but do I have to make a custom event everytime I want to listen to a event in a child component?

Nope, it would be really fastidious, for this we have...

### Event forwarding

In most cases, you simply need to listen to an event from an ancestor component.

We could do custom events everytime, but as stated, like, 3 lines above, it would be a pain in the carpal tunnel.
I don't know about you, but the less code I write, the happier I am.

Well lucky me, there's an easy solution to my woes.

```html
<button on:click>CLICK ME</button>
```

That's it ?

That's it. If you use an `on:` directive without a value, it's automatically forwarded to the parent.

You can still use modifiers.

You can forward it as many times as you want, up the entire chain of components if needs be, with the same syntax.

Isn't it beautiful ?
Well yes, but there are caveats to this beauty. 

Onto...

## The Bad

The bad isn't that bad, it gets worse later. For now let's just get a sneak peek by looking at the competition.

Overall I like the idea of the child component simply emitting events, and the parent listening to those.

It's what `Angular` does, it's what `Vue3` does, it's what `Svelte` does.

It's nice, it's organic, it makes sense.

Not that what `React` does isn't, but I like this better
(Insert [This is brilliant but I like this better](https://knowyourmeme.com/memes/this-is-brilliant-but-i-like-this) meme).

There's one instance where `Svelte` forwarding is a lot worse than `React` approach.

What if you want to use the same handler for multiple events ?

```html
<!-- HOC.Svelte -->
<script>
    const handlePointerEvents = () => null
</script>

<Button on:mousedown={handlePointerEvent} on:touchstart={handlePointerEvent} on:pointerdown={handlePointerEvent} />


<!-- Button.Svelte -->
<button on:mousedown on:touchstart on:pointerdown>CLICK ME</button>
```

You need to forward each one of them.

What about `React` then ?

```javascript
export function HOC() {
    const handlePointerEvent = () => null

    return <Button 
            onMouseDown={handlePointerEvent}
            onTouchStart={handlePointerEvent}
            onPointerDown={handlePointerEvent}
        />
}

function Button(props) {
    return <button {...props}>CLICK ME</button>
}
```

Easy spread, easy life. It makes refactoring the code a lot easier.
 
But the easiness of refactoring the code isn't the only issue that we just unveiled with this little experiment.
It might even be the least of our worries, as we dive head first into...

## The Ugly

As I stated in the beginning, I was prompted to write this article when I decided to write a component library using Svelte.

There's one major difference between building an app and a library.
You can't make any assumptions on how the library is going to be used.

### The issue

If you create a `Button` component for your app, you know which events you need.
You can add more as you go.

If you do the same for a library, you need to forward __all__ events. Every. Single. One.

And unlike `React`, you can't pass them as props and spread them.

You could do that

```html
<!-- HOC.Svelte -->
<Button onclick="alert('Button Clicked!')" />


<!-- Button.Svelte -->
<button {...$$props}>CLICK ME</button>
```

But this is very limited as this would not work

```html
<!-- HOC.Svelte -->
<script>
    function handleClick() {
        alert('Button Clicked!')
    }
</script>

<Button onclick="handleClick()" />


<!-- Button.Svelte -->
<button {...$$props}>CLICK ME</button>
```

Right now there no equivalent to `$$props` for the `on:` directives.

If you look under the hood, you can find them stored in the component instance, more precisely `component.$$.callbacks`,
but they are for internal use and are not exposed.

To access those callbacks you need to use `get_current_component` from `svelte/internal`.

Anyway, it would go against the `Svelte` approach. Events are going up, not down. Begone `React`.

How do we solve this then ?

### The solution

__Warning__: It's not a perfect one, it makes use of `svelte/internal` tools that are prone to changing without warning which may brick your code.

This solution is from [@hperrin](https://github.com/hperrin) (and so is the [warning](https://github.com/sveltejs/svelte/issues/2837#issuecomment-516137618)).

The idea here is make our lives easier, by using code to forward all the events for us.

Less to type, less code generated, easier to maintain by adding new events only once, etc...

Here is the code (you can find it in [his own library](https://github.com/hperrin/svelte-material-ui))

```javascript
// forwardEventsBuilder.js
import {bubble, listen} from 'svelte/internal';

export function forwardEventsBuilder(component, additionalEvents = []) {
  const events = [
    'focus', 'blur',
    'fullscreenchange', 'fullscreenerror', 'scroll',
    'cut', 'copy', 'paste',
    'keydown', 'keypress', 'keyup',
    'auxclick', 'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', 'pointerlockchange', 'pointerlockerror', 'select', 'wheel',
    'drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop',
    'touchcancel', 'touchend', 'touchmove', 'touchstart',
    'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 'gotpointercapture', 'lostpointercapture',
    ...additionalEvents
  ];

  function forward(e) {
    bubble(component, e);
  }

  return node => {
    const destructors = [];

    for (let i = 0; i < events.length; i++) {
      destructors.push(listen(node, events[i], forward));
    }

    return {
      destroy: () => {
        for (let i = 0; i < destructors.length; i++) {
          destructors[i]();
        }
      }
    }
  };
}
```

So what's going on here.

Well, we made a list of every native events, with the option to add custom events through the second argument,
and return a method that will be called for each instance of our component.

When the method is called, we receive the node corresponding to our component.
Then we create listeners for each event, with the internal `listen` method,
and forward those with the internal `bubble` method on trigger.

For cleaning purposes, we store the destructors returned by the `listen` method inside an array,
and call each one inside the `destroy` callback.

### How to use it

```html
<!-- Button.svelte -->
<script>
    import { get_current_component } from 'svelte/internal'
    import { forwardEventsBuilder } from './forwardEventsBuilder'

    const forwardEvents = forwardEventsBuilder(get_current_component())
</script>

<button use:forwardEvents>
    CLICK ME
</button>
```

First we get the component reference from `svelte/internal` using the `get_current_component` method.
And we pass it to the `forwardEventsBuilder`.
We can add our own custom events here, as needed.

Then the [`use:` directive](https://svelte.dev/docs#use_action).
It will call the `forwardEvents` methods for each new instance of the component, and pass the node we need to it.
No need for a value, as we don't need any additional arguments.

And that's it.

It's not perfect, it might break in the future, but _for now_ it's as good as it's going to be.

## The future

There is a more long term solution being [discussed](https://github.com/sveltejs/svelte/issues/2837).

By using the syntax `on:*` we could forward all events automatically.

The benefits of this proposition are the simplicity of it, and the fact that it would not be a hack.
Can't stress the last part enough.

A [pull request](https://github.com/sveltejs/svelte/pull/4599) by [@RedHatter](https://github.com/RedHatter) is currently open.
So hopefully we can get our hands on it soon.

Which ever solution ends up being implemented, it cannot come soon enough.

Right now building a component library is a bit of mess because of this.
And, for me at least, it's the bare minimum to be able to use the framework for large projects.

/rant
