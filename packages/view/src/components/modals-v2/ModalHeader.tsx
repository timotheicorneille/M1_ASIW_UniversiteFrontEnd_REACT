import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const modalHeaderVariants = cva(
  "px-6 py-4 border-b border-gray-200",
  {
    variants: {
      variant: {
        default: "bg-white",
        primary: "bg-blue-50",
        success: "bg-green-50",
        warning: "bg-yellow-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ModalHeaderProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof modalHeaderVariants>;

export const ModalHeader = ({ children, variant, className }: ModalHeaderProps) => {
  return (
    <div className={cn(modalHeaderVariants({ variant }), className)}>
      {children}
    </div>
  );
};

