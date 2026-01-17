import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const modalFooterVariants = cva(
  "px-6 py-4 border-t border-gray-200",
  {
    variants: {
      align: {
        left: "flex justify-start",
        center: "flex justify-center",
        right: "flex justify-end",
        between: "flex justify-between",
      },
      gap: {
        sm: "gap-2",
        default: "gap-3",
        lg: "gap-4",
      },
    },
    defaultVariants: {
      align: "right",
      gap: "default",
    },
  }
);

type ModalFooterProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof modalFooterVariants>;

export const ModalFooter = ({ children, align, gap, className }: ModalFooterProps) => {
  return (
    <div className={cn(modalFooterVariants({ align, gap }), className)}>
      {children}
    </div>
  );
};
