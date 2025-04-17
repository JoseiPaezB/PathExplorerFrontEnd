import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface DropdownCardProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  style?: React.CSSProperties;
}

const DropdownCard: React.FC<DropdownCardProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  style,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      setTimeout(() => {
        dropdownRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // ⏳ Pequeño retraso para mejor UX
    }
  }, [isOpen]);

  return (
    <motion.div
      ref={dropdownRef} // 👈 Referencia al elemento principal
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="overflow-hidden rounded-2xl bg-[#B533FF]/5"
      style={{ borderRadius: "1rem", ...style }}
    >
      <button
        onClick={onToggle} // Usamos la función `onToggle` que viene de props
        className="group relative flex w-full items-center justify-between bg-primary-50/50 px-6 py-5 text-left transition-colors hover:bg-indigo-50"
      >
        <motion.span
          className="text-lg font-medium text-primary-900"
          animate={{ opacity: isOpen ? 1 : 0.8 }}
        >
          {title}
        </motion.span>
        <motion.div
          variants={{
            open: { rotate: 180, color: "#B533FF" },
            closed: { rotate: 0, color: "#A100FF" },
          }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>

      <motion.div
        variants={{
          open: { height: "auto", opacity: 1, y: 0 },
          closed: { height: 0, opacity: 0, y: -10 },
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="px-6 py-5 text-slate-600">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default DropdownCard;
