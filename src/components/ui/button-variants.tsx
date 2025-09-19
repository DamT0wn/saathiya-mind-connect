import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-wellness focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-wellness",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "hero-gradient text-white font-semibold border-0 hover:scale-105 shadow-medium",
        wellness: "wellness-gradient text-white font-medium border-0 hover:scale-105",
        calm: "bg-wellness-calm text-white hover:bg-wellness-calm/90",
        energy: "bg-wellness-energy text-white hover:bg-wellness-energy/90",
        focus: "bg-wellness-focus text-focus-foreground hover:bg-wellness-focus/90",
        chat: "bg-primary text-primary-foreground hover:bg-primary-hover rounded-full px-6",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        chat: "h-12 px-6 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);