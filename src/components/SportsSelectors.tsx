import {
  useCheckbox,
  VisuallyHidden,
  tv
} from "@heroui/react";

export const CheckIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CustomSportCheckbox = ({ icon: Icon, children, ...props }) => {
  const checkbox = tv({
    slots: {
      base: "border border-gray-400 bg-transparent rounded-md p-2 hover:bg-gray-100 transition cursor-pointer",
      content: "text-gray-700 font-medium flex flex-col items-center justify-center gap-1 text-sm",
    },
    variants: {
      isSelected: {
        true: {
          base: "bg-gray-600 border-gray-700 text-white",
          content: "text-white",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-none ring-2 ring-gray-400 ring-offset-2",
        },
      },
    },
  });

  const {
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps
  } = useCheckbox({ ...props });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()} className={styles.base()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div {...getLabelProps()} className={`${styles.content()} min-w-14`}>
        {Icon && <Icon className="h-8 w-8 overflow-hidden" />}
        <span className="line-clamp-1 text-[10px]">{children}</span>
      </div>
    </label>
  );
};