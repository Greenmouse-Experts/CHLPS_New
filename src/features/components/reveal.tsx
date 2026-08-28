"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px",
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function dropWillChange(targets: HTMLElement[]) {
  const onEnd = (event: TransitionEvent) => {
    if (event.propertyName !== "opacity" && event.propertyName !== "transform") {
      return;
    }
    (event.currentTarget as HTMLElement).classList.add("reveal-done");
  };

  targets.forEach((node) => node.addEventListener("transitionend", onEnd));

  return () => {
    targets.forEach((node) => node.removeEventListener("transitionend", onEnd));
  };
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(el);
      }
    }, OBSERVER_OPTIONS);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay }: RevealProps) {
  const { ref, isVisible } = useInView();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isVisible) return;
    return dropWillChange([el]);
  }, [isVisible, ref]);

  const style =
    delay !== undefined
      ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
      : undefined;

  return (
    <div
      ref={ref}
      className={`reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
};

export function RevealGroup({ children, className = "" }: RevealGroupProps) {
  const { ref, isVisible } = useInView();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isVisible) return;
    return dropWillChange([...el.querySelectorAll<HTMLElement>(".reveal")]);
  }, [isVisible, ref]);

  return (
    <div
      ref={ref}
      className={`reveal-group${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
