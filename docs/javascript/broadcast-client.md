# Broadcast Client

## Client

Simple client implementation to make it easier to use Broadcast Channel for multi-tab communication.
Using [broadcast-channel](https://github.com/pubkey/broadcast-channel) for polyfill.
You can also use the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API).

```ts title="/src/**/broadcast-client.ts"
import type { OnMessageHandler } from 'broadcast-channel';

import { BroadcastChannel } from 'broadcast-channel';

// Add channels as needed
type AvailableChannel = 'logout';

class BroadcastClient {
  private channels: Map<AvailableChannel, BroadcastChannel>;

  constructor() {
    this.channels = new Map();
  }

  private getChannel<T>(channelName: AvailableChannel): BroadcastChannel<T> {
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = new BroadcastChannel(channelName);
      this.channels.set(channelName, channel);
    }

    return channel;
  }

  listen<T>(channelName: AvailableChannel, onmessage: OnMessageHandler<T>) {
    const channel = this.getChannel<T>(channelName);
    channel.onmessage = onmessage;

    return () => {
      this.close(channelName);
    };
  }

  post<T>(channelName: AvailableChannel, message: T, includeSelf = false) {
    if (includeSelf) {
      // Broadcast channel ignore messages from the same instance
      const inclusiveChannel = new BroadcastChannel<T>(channelName);
      inclusiveChannel.postMessage(message);
      inclusiveChannel.close();
    } else {
      const channel = this.getChannel<T>(channelName);
      channel.postMessage(message);
    }
  }

  close(channelName: AvailableChannel): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.close();
      this.channels.delete(channelName);
    }
  }
}

export const broadcastClient = new BroadcastClient();
```

## Usage

```html title="/src/index.html"

<script>
  import {broadcastClient} from "/src/**/broadcast-client";

  let logoutListener;

  function handleLoad() {
    logoutListener = broadcastClient.listen('logout', () => {
      window.location.assign('/logged-out');
    });
  }

  function handleUnload() {
    logoutListener?.close();
  }

  window.addEventListener('load', handleLoad, {once: true});
  window.addEventListener('beforeunload', handleUnload, {once: true});
</script>
```

```html title="/src/**/logoutButton.html"

<script>
  import {broadcastClient} from "/src/**/broadcast-client";

  function propagateLogout() {
    broadcastClient.post('logout', true);
  }
</script>

<a href="/logged-out" onclick="propagateLogout()">Log Out</a>
```
