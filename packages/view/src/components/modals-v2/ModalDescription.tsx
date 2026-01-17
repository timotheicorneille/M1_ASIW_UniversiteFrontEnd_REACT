import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const modalDescriptionVariants = cva(
  "mt-2",
  {
    variants: {
      variant: {
        default: "text-gray-600",
        muted: "text-gray-500",
        emphasis: "text-gray-900 font-medium",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ModalDescriptionProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof modalDescriptionVariants>;

export const ModalDescription = ({ children, variant, size, className }: ModalDescriptionProps) => {
  return (
    <p className={cn(modalDescriptionVariants({ variant, size }), className)}>
      {children}
    </p>
  );
};

