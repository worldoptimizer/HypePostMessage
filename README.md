# HypePostMessage

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

**HypePostMessage** is a lightweight JavaScript library designed to facilitate seamless communication between parent and child iframes within [Tumult Hype](https://tumult.com/hype/) documents. It allows you to post and handle custom events and behaviors with ease, supporting event propagation in both upward and downward directions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Including HypePostMessage](#including-hypepostmessage)
  - [Posting Events](#posting-events)
  - [Handling Events](#handling-events)
  - [Posting Behaviors](#posting-behaviors)
- [API Reference](#api-reference)
  - [Propagation](#propagation)
  - [postEvent(eventName, eventData, options)](#posteventeventname-eventdata-options)
  - [postBehavior(hypeDocument, behaviorName, options)](#postbehaviorhypedocument-behaviorname-options)
- [Examples](#examples)
  - [Basic Event Posting](#basic-event-posting)
  - [Posting a Behavior](#posting-a-behavior)
- [License](#license)

## Features

- **Event Posting:** Send custom events between parent and child iframes.
- **Event Handling:** Listen and respond to incoming events.
- **Behavior Triggering:** Post and handle custom behaviors within Hype documents.
- **Propagation Control:** Easily propagate events up or down the iframe hierarchy.
- **Flexible Targeting:** Specify target iframes using CSS selectors.

## Installation

Since **HypePostMessage** is tailored for use with Tumult Hype, it can be easily integrated by including the script directly in your Hype project.

### Including HypePostMessage

1. **Download the Script:**

   Download the [`HypePostMessage.js`](https://github.com/yourusername/HypePostMessage/blob/main/HypePostMessage.js) file from the repository.

2. **Add to Your Project:**

   - Open your Hype project.
   - Go to the **Resources** panel.
   - Click the **+** button and select **Add External JavaScript**.
   - Choose the downloaded `HypePostMessage.js` file to include it in your project.

   Alternatively, you can host the script on your server and include it via a `<script>` tag.

   ```html
   <script src="path/to/HypePostMessage.js"></script>
   ```

## Usage

Once **HypePostMessage** is included in your Tumult Hype project, you can start posting and handling events and behaviors between iframes.

### Including HypePostMessage

Ensure that the `HypePostMessage.js` script is included in all relevant Hype documents (both parent and child iframes).

### Posting Events

Use the `postEventToParent` or `postEventToChildren` methods attached to the `hypeDocument` object to send custom events.

```javascript
// Post a simple event to the parent window
hypeDocument.postEventToParent('myCustomEvent', { key: 'value' });

// Post an event to all child iframes
hypeDocument.postEventToChildren('myCustomEvent', { key: 'value' });
```

### Handling Events

Listen for incoming events using the `HypePostEventReceived` custom event.

```javascript
document.addEventListener('HypePostEventReceived', function(event) {
  const { name, data } = event.detail;
  if (name === 'myCustomEvent') {
    console.log('Received data:', data);
    // Handle the event
  }
});
```

### Posting Behaviors

Trigger custom behaviors within Hype documents using `postBehaviorToParent` or `postBehaviorToChildren`.

```javascript
// Post a behavior to the parent window
hypeDocument.postBehaviorToParent('myBehavior');

// Post a behavior to all child iframes with additional options
hypeDocument.postBehaviorToChildren('myBehavior', { documentId: 'doc123', propagate: true });
```

## API Reference

### `Propagation`

An enumeration of valid propagation values.

| Value | Description                        |
|-------|------------------------------------|
| `NONE` | No propagation                     |
| `UP`   | Propagate the event to the parent   |
| `DOWN` | Propagate the event to the children |

### `postEvent(eventName, eventData, options)`

**Note:** This method is available via the `hypeDocument` object as `postEventToParent` and `postEventToChildren`.

Posts a custom event to either the parent or child iframes.

- **Parameters:**
  - `eventName` (String): The name of the event to send.
  - `eventData` (*): Optional data to send with the event.
  - `options` (Object): Optional parameters.
    - `propagate` (Boolean): Whether to propagate the event. Default is `false`.
    - `selector` (String): CSS selector to target specific iframes. Default is `'iframe'`.
    - `direction` (String): Direction to post (`'parent'` or `'children'`). Default is `'parent'`.

- **Example:**

  ```javascript
  // Using hypeDocument to post an event to children with propagation
  hypeDocument.postEventToChildren('userLoggedIn', { userId: 123 }, { propagate: true });
  ```

### `postBehavior(hypeDocument, behaviorName, options)`

**Note:** This method is available via the `hypeDocument` object as `postBehaviorToParent` and `postBehaviorToChildren`.

Posts a custom behavior to trigger within Hype documents.

- **Parameters:**
  - `hypeDocument` (Object): The current Hype document.
  - `behaviorName` (String): The name of the custom behavior to trigger.
  - `options` (Object): Optional parameters.
    - `documentId` (String|Array): Target specific document IDs.
    - `propagate` (Boolean): Whether to propagate the behavior. Default is `false`.
    - `selector` (String): CSS selector to target specific iframes. Default is `'iframe'`.
    - `direction` (String): Direction to post (`'parent'` or `'children'`). Default is `'parent'`.

- **Example:**

  ```javascript
  // Using hypeDocument to post a behavior to parent with specific document ID
  hypeDocument.postBehaviorToParent('refreshData', { documentId: 'doc123', propagate: true });
  ```

## Examples

### Basic Event Posting

**Parent Window:**

```javascript
// Listen for events
document.addEventListener('HypePostEventReceived', function(event) {
  const { name, data } = event.detail;
  if (name === 'childEvent') {
    console.log('Received from child:', data);
  }
});

// Send an event to the child iframe
hypeDocument.postEventToChildren('parentEvent', { message: 'Hello Child' });
```

**Child Iframe:**

```javascript
// Listen for events
document.addEventListener('HypePostEventReceived', function(event) {
  const { name, data } = event.detail;
  if (name === 'parentEvent') {
    console.log('Received from parent:', data);
  }
});

// Send an event to the parent window
hypeDocument.postEventToParent('childEvent', { message: 'Hello Parent' });
```

### Posting a Behavior

Trigger a custom behavior within a Hype document.

```javascript
// Trigger 'startAnimation' behavior in the parent document
hypeDocument.postBehaviorToParent('startAnimation');
```

In the parent Hype document, ensure that the custom behavior `startAnimation` is defined and ready to be triggered.

## License

This project is licensed under the [MIT License](LICENSE).

---

© 2024 Max Ziebell, [maxziebell.de](https://maxziebell.de).
