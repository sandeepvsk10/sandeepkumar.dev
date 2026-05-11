"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import "./Dock.css";

export type DockSpring = {
  mass?: number;
  stiffness?: number;
  damping?: number;
};

export type DockItemData = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
};

type DockItemProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  spring: DockSpring;
  distance: number;
  magnification: number;
  baseItemSize: number;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  /** clientX + getBoundingClientRect() both use viewport coordinates (unlike pageX when scrolled). */
  const sizeFromMouse = useTransform(mouseX, (val) => {
    if (!Number.isFinite(val)) return baseItemSize;
    const el = ref.current;
    if (!el) return baseItemSize;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const offset = val - center;
    const abs = Math.abs(offset);
    if (abs >= distance) return baseItemSize;
    const mix = 1 - abs / distance;
    return baseItemSize + (magnification - baseItemSize) * mix;
  });

  const size = useSpring(sizeFromMouse, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ isHovered?: MotionValue<number> }>, {
              isHovered,
            })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "", isHovered: _h }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: DockSpring;
};

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height,
        scrollbarWidth: "none",
        width: "max-content",
        maxWidth: "100%",
      }}
      className="dock-outer"
      onMouseMove={(e) => {
        isHovered.set(1);
        mouseX.set(e.clientX);
      }}
      onMouseLeave={() => {
        isHovered.set(0);
        mouseX.set(Number.POSITIVE_INFINITY);
      }}
    >
      <motion.div
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Social dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className ?? ""}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
