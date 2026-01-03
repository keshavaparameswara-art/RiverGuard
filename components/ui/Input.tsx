import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className={styles.container}>
                {label && <label className={styles.label}>{label}</label>}
                <input
                    className={cn(styles.input, error && styles.errorInput, className)}
                    ref={ref}
                    {...props}
                />
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
