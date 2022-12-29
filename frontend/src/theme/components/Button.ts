const Button = {
  variants: {
    primary: {
      bg: "primary.green.100",
      color: "white",
      _hover: {
        bg: `primary.green.200`,
        _disabled: {
          bg: `primary.green.200`,
        },
      },

      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    secondary: {
      border: "2px",
      borderColor: "primary.green.100",
      color: "primary.green.100",
      _hover: {
        bg: `background.grey.400`,
      },
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    backgroundInteractive: {
      bg: "background.interactive.100",
      _hover: {
        bg: `primary.interactive.200`,
      },
    },
  },
};

export default Button;
