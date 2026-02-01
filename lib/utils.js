import { clsx } from "clsx"
//clsx is a library that lets you toggle class names easily
import { twMerge } from "tailwind-merge"
//twMerge is a library that merges tailwind classes

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
