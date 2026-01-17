import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const modalTitleVariants = cva(
  "font-semibold",
  {
    variants: {
      variant: {
        default: "text-gray-900",
        primary: "text-blue-900",
        underline: "border-b-2 border-blue-500 inline-block",
      },
      size: {
        sm: "text-lg",
        default: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ModalTitleProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof modalTitleVariants>;

export const ModalTitle = ({ children, variant, size, className }: ModalTitleProps) => {
  return (
    <h2 className={cn(modalTitleVariants({ variant, size }), className)}>
      {children}
    </h2>
  );
};

