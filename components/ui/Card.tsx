import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "bordered";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(styles.card, styles[variant], className)}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

export { Card };
