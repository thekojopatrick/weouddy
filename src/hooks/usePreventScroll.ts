import { useEffect, useLayoutEffect } from "react";

// Platform detection utilities
interface NavigatorPlatform {
  platform: string;
  maxTouchPoints?: number;
}

//type PlatformCheck = () => boolean;

interface NavigatorPlatform {
  platform: string;
  maxTouchPoints?: number;
}

// Helper to safely check if we're in a browser environment
const isBrowser = (): boolean => {
  return typeof window !== "undefined" && window.navigator != null;
};

// Helper to safely get navigator
const getNavigator = (): NavigatorPlatform | null => {
  if (!isBrowser()) return null;
  return window.navigator as NavigatorPlatform;
};

const testPlatform = (re: RegExp): boolean => {
  const navigator = getNavigator();
  if (!navigator) return false;
  return re.test(navigator.platform);
};

// Helper to safely get maxTouchPoints
const getMaxTouchPoints = (): number => {
  const navigator = getNavigator();
  if (!navigator) return 0;
  return navigator.maxTouchPoints ?? 0;
};

const platformChecks = {
  isMac: (): boolean => testPlatform(/^Mac/),
  isIPhone: (): boolean => testPlatform(/^iPhone/),
  isIPad: (): boolean => {
    return (
      testPlatform(/^iPad/) ||
      // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
      (platformChecks.isMac() && getMaxTouchPoints() > 1)
    );
  },
  isIOS: (): boolean => platformChecks.isIPhone() || platformChecks.isIPad(),
};

// DOM Types and Utilities
interface ScrollableElement extends Element {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}

// interface TouchCoordinates {
//   pageY: number;
// }

interface ScrollState {
  scrollable: ScrollableElement | null;
  lastY: number;
}

const KEYBOARD_BUFFER = 24;
const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
]);

// Hook Options Type
interface PreventScrollOptions {
  isDisabled?: boolean;
  focusCallback?: () => void;
}

// DOM Utilities
const isScrollable = (node: Element): boolean => {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(
    `${style.overflow}${style.overflowX}${style.overflowY}`,
  );
};

const getScrollParent = (node: Element): Element => {
  if (node && isScrollable(node)) {
    node = node.parentElement as Element;
  }

  while (node && !isScrollable(node)) {
    node = node.parentElement as Element;
  }

  return node || document.scrollingElement || document.documentElement;
};

const isInput = (target: Element): boolean => {
  return (
    (target instanceof HTMLInputElement &&
      !NON_TEXT_INPUT_TYPES.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
};

// Style Management
interface StyleRestoreFunction {
  (): void;
}

type CSSPropertyName = keyof Omit<
  CSSStyleDeclaration,
  | "length"
  | "parentRule"
  | "getPropertyPriority"
  | "getPropertyValue"
  | "item"
  | "removeProperty"
  | "setProperty"
>;

const setStyle = (
  element: HTMLElement,
  style: CSSPropertyName,
  value: string,
): StyleRestoreFunction => {
  // Get the current computed value
  const currentValue = getComputedStyle(element).getPropertyValue(
    style
      .toString()
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase(),
  );

  // Convert camelCase to kebab-case for CSS property names
  const cssProperty = style
    .toString()
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();

  // Set the new value
  element.style.setProperty(cssProperty, value);

  // Return function to restore the original value
  return () => {
    element.style.setProperty(cssProperty, currentValue);
  };
};

// Event Management
type EventHandler<K extends keyof GlobalEventHandlersEventMap> = (
  this: Document,
  ev: GlobalEventHandlersEventMap[K],
) => void;

const addEvent = <K extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  event: K,
  handler: EventHandler<K>,
  options?: boolean | AddEventListenerOptions,
): (() => void) => {
  target.addEventListener(event, handler as EventListener, options);
  return () => {
    target.removeEventListener(event, handler as EventListener, options);
  };
};

// Scroll Management
const scrollIntoView = (target: Element): void => {
  const root = document.scrollingElement || document.documentElement;
  let currentTarget: Element | null = target;

  while (currentTarget && currentTarget !== root) {
    const scrollable = getScrollParent(currentTarget) as ScrollableElement;
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== currentTarget
    ) {
      const scrollableRect = scrollable.getBoundingClientRect();
      const targetRect = currentTarget.getBoundingClientRect();
      const keyboardHeight = scrollableRect.bottom + KEYBOARD_BUFFER;

      if (targetRect.bottom > keyboardHeight) {
        scrollable.scrollTop += targetRect.top - scrollableRect.top;
      }
    }
    currentTarget = scrollable.parentElement;
  }
};

// Mobile Safari Scroll Prevention
const preventScrollMobileSafari = (): (() => void) => {
  const state: ScrollState = {
    scrollable: null,
    lastY: 0,
  };

  const handlers = {
    touchStart: (e: TouchEvent) => {
      state.scrollable = getScrollParent(
        e.target as Element,
      ) as ScrollableElement;
      if (
        state.scrollable === document.documentElement ||
        state.scrollable === document.body
      ) {
        return;
      }
      state.lastY = e.changedTouches[0].pageY;
    },

    touchMove: (e: TouchEvent) => {
      if (
        !state.scrollable ||
        state.scrollable === document.documentElement ||
        state.scrollable === document.body
      ) {
        e.preventDefault();
        return;
      }

      const y = e.changedTouches[0].pageY;
      const { scrollTop, scrollHeight, clientHeight } = state.scrollable;
      const bottom = scrollHeight - clientHeight;

      if (bottom === 0) return;

      if (
        (scrollTop <= 0 && y > state.lastY) ||
        (scrollTop >= bottom && y < state.lastY)
      ) {
        e.preventDefault();
      }

      state.lastY = y;
    },

    touchEnd: (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (isInput(target) && target !== document.activeElement) {
        e.preventDefault();
        target.style.transform = "translateY(-2000px)";
        target.focus();
        requestAnimationFrame(() => {
          target.style.transform = "";
        });
      }
    },

    focus: (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (isInput(target)) {
        target.style.transform = "translateY(-2000px)";
        requestAnimationFrame(() => {
          target.style.transform = "";
          if (window.visualViewport) {
            if (window.visualViewport.height < window.innerHeight) {
              requestAnimationFrame(() => {
                scrollIntoView(target);
              });
            } else {
              window.visualViewport.addEventListener(
                "resize",
                () => scrollIntoView(target),
                { once: true },
              );
            }
          }
        });
      }
    },

    windowScroll: () => {
      window.scrollTo(0, 0);
    },
  };

  // Store initial scroll position
  const scrollPosition = {
    x: window.pageXOffset,
    y: window.pageYOffset,
  };

  // Apply styles and scroll to top
  const restoreStyles = setStyle(
    document.documentElement,
    "paddingRight",
    `${window.innerWidth - document.documentElement.clientWidth}px`,
  );

  window.scrollTo(0, 0);

  // Add event listeners
  const cleanupEvents = [
    addEvent(document, "touchstart", handlers.touchStart, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "touchmove", handlers.touchMove, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "touchend", handlers.touchEnd, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "focus", handlers.focus, true),
    addEvent(window, "scroll", handlers.windowScroll),
  ];

  // Return cleanup function
  return () => {
    restoreStyles();
    cleanupEvents.forEach((cleanup) => cleanup());
    window.scrollTo(scrollPosition.x, scrollPosition.y);
  };
};

// Main Hook
let preventScrollCount = 0;
let restore: (() => void) | undefined;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const usePreventScroll = (options: PreventScrollOptions = {}): void => {
  const { isDisabled } = options;

  useIsomorphicLayoutEffect(() => {
    if (isDisabled) return;

    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (platformChecks.isIOS()) {
        restore = preventScrollMobileSafari();
      }
    }

    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore?.();
      }
    };
  }, [isDisabled]);
};

export default usePreventScroll;
