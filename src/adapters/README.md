# Adapters

An adapter connects one AI agent (Claude Code, …) to Agentling. It answers two questions:

1. **How do I learn what the agent is doing?** Usually by registering a hook/callback in the agent's own config that runs `bin/agentling-hook.js <adapter-id> <event>`.
2. **How do I translate the agent's event into a pet state?** That is `translate(event, payload)`.

## Interface

```js
module.exports = {
  id: 'my-agent',            // [a-z0-9-]+, used in state file names and CLI
  name: 'My Agent',          // shown in menus

  // Pure function. `event` is the argument the hook was called with, `payload` the parsed JSON from stdin ({} if none).
  // Return { session, state }: state is 'idle' | 'thinking' | 'working' | 'attention',
  // `null` to forget the session, or `undefined` to ignore the event.
  translate(event, payload) { … },

  // Optional: lets `npm run connect` and the app menu wire the agent up automatically.
  detect()       { … },  // is the agent installed on this machine?
  isConnected()  { … },  // are our hooks registered?
  connect()      { … },  // register them (idempotent, reversible, never touch unrelated config)
  disconnect()   { … },
};
```

Register it in `index.js`. Look at `claude-code/` for a full example and `generic.js` for the simplest one.

## Agents without hooks

Anything that can run a shell command can drive the pet through the **generic** adapter:

```bash
node bin/agentling-hook.js generic working     # events are state names: idle | thinking | working | attention | end
echo '{"session_id":"build-42"}' | node bin/agentling-hook.js generic attention
```
