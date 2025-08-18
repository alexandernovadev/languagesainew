import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-white group-[.toaster]:border-zinc-600 group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:py-2",
          description: "group-[.toast]:text-zinc-300",
          actionButton:
            "group-[.toast]:bg-green-600 group-[.toast]:text-white group-[.toast]:ml-0 hover:bg-green-700 transition-colors !important",
          cancelButton:
            "group-[.toast]:bg-zinc-700 group-[.toast]:text-zinc-200 group-[.toast]:mr-0 hover:bg-zinc-600 transition-colors !important",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
