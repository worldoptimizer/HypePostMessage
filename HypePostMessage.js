/*!
 * HypePostMessage v1.0.0
 * Copyright (2024) Max Ziebell, (https://maxziebell.de). MIT-license
 */

/*
 * Version-History
 * 1.0.0 Released under MIT-license
 */

if (!window.HypePostMessage) {
  window.HypePostMessage = (function () {
    /**
     * Valid propagation values
     */
    const Propagation = {
      NONE: "none",
      UP: "up",
      DOWN: "down"
    };

    /**
     * Post a generic event
     * @param {String} eventName - The name of the event to send
     * @param {*} [eventData] - Optional data to send with the event
     * @param {Object} [options] - Optional parameters for event posting
     * @param {Boolean} [options.propagate=false] - Whether to propagate the event
     * @param {String} [options.selector='iframe'] - CSS selector to target specific iframes
     * @param {String} [options.direction='parent'] - Direction to post ('parent' or 'children')
     */
    function postEvent(eventName, eventData, options = {}) {
      const propagate = options.propagate || false;
      const selector = options.selector || "iframe";
      const direction = options.direction || 'parent';

      const message = {
        type: "HypePostEvent",
        name: eventName,
        data: eventData,
        propagate: propagate
      };

      try {
        if (direction === 'parent') {
          window.parent.postMessage(message, "*");
        } else if (direction === 'children') {
          const iframes = document.querySelectorAll(selector);
          iframes.forEach(iframe => {
            iframe.contentWindow.postMessage(message, "*");
          });
        }
      } catch (err) {
        console.warn(`HypePostMessage: Error posting event to ${direction}:`, err);
      }
    }

    /**
     * Handle incoming postMessages for HypePostEvent
     * @param {MessageEvent} event - The message event containing the event data
     */
    function handlePostEvent(event) {
      if (event.data.type !== "HypePostEvent") return;

      const { name, data, propagate } = event.data;

      // Dispatch a custom event within the document
      const customEvent = new CustomEvent("HypePostEventReceived", {
        detail: { name, data, propagate }
      });
      document.dispatchEvent(customEvent);

      // Handle propagation based on the propagate flag
      if (propagate) {
        const isParent = window.parent && window.parent !== window;
        if (isParent) {
          postEvent(name, data, { propagate: true, direction: 'parent' });
        } else {
          postEvent(name, data, { propagate: true, direction: 'children' });
        }
      }
    }

    /**
     * Post a custom behavior
     * @param {Object} hypeDocument - The current Hype document.
     * @param {String} behaviorName - The name of the custom behavior to trigger.
     * @param {Object} [options] - Optional parameters to control behavior posting.
     * @param {String|Array} [options.documentId] - Target specific document IDs.
     * @param {Boolean} [options.propagate=false] - Whether to propagate the behavior.
     * @param {String} [options.selector='iframe'] - CSS selector to target specific iframes.
     * @param {String} [options.direction='parent'] - Direction to post ('parent' or 'children')
     */
    function postBehavior(hypeDocument, behaviorName, options = {}) {
      const eventData = {
        behavior: behaviorName,
        documentId: options.documentId
      };
      const eventOptions = {
        propagate: options.propagate || false,
        selector: options.selector || "iframe",
        direction: options.direction || 'parent'
      };
      postEvent("HypePostMessage", eventData, eventOptions);
    }

    /**
     * Handle incoming HypePostMessage events
     * @param {CustomEvent} event - The custom event containing the behavior data
     */
    function handleBehaviorEvent(event) {
      if (event.detail.name !== "HypePostMessage") return;

      const { data } = event.detail;

      if (!window.HYPE || !window.HYPE.documents) return;

      Object.values(window.HYPE.documents).forEach(hypeDocument => {
        if (!hypeDocument) return;

        if (!data.documentId ||
            (Array.isArray(data.documentId) && data.documentId.includes(hypeDocument.documentId())) ||
            data.documentId === hypeDocument.documentId()) {
          hypeDocument.triggerCustomBehaviorNamed(data.behavior, data);
        }
      });
    }

    /**
     * HypeDocumentLoad handler: Extend the hypeDocument when loaded
     * @param {Object} hypeDocument - The current Hype document.
     */
    function HypeDocumentLoad(hypeDocument, element, event) {
      hypeDocument.postEventToParent = function (eventName, eventData, options = {}) {
        postEvent(eventName, eventData, { ...options, direction: 'parent' });
      };

      hypeDocument.postEventToChildren = function (eventName, eventData, options = {}) {
        postEvent(eventName, eventData, { ...options, direction: 'children' });
      };

      hypeDocument.postBehaviorToParent = function (behaviorName, options = {}) {
        postBehavior(hypeDocument, behaviorName, { ...options, direction: 'parent' });
      };

      hypeDocument.postBehaviorToChildren = function (behaviorName, options = {}) {
        postBehavior(hypeDocument, behaviorName, { ...options, direction: 'children' });
      };

      document.addEventListener("HypePostEventReceived", function(receivedEvent) {
        if (receivedEvent.detail.name === "HypePostMessage") {
          handleBehaviorEvent(receivedEvent);
        }
      });
    }

    // Initialize event listeners
    window.addEventListener("message", handlePostEvent, false);

    // Register HypeDocumentLoad event listener
    if (!window.HYPE_eventListeners) {
      window.HYPE_eventListeners = [];
    }
    window.HYPE_eventListeners.push({ type: "HypeDocumentLoad", callback: HypeDocumentLoad });

    // Public API
    return {
      version: '1.0.0',
      Propagation,
      postEvent,
      postBehavior,
      handleBehaviorEvent
    };
  })();
}
