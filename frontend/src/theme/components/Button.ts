const Button = {
  variants: {
    googleLogin: {
      background: "background.white.100",
      border: "2px",
      borderColor: "primary.green.100",
      color: "primary.green.100",
      py: "20px",
      px: "25px",
    },
    googleLoginError: {
      background: "background.white.100",
      border: "2px",
      borderColor: "text.critical.100",
      color: "text.critical.100",
      py: "20px",
      px: "35px",
    },
    primaryGreen: {
      bg: "primary.green.100",
      color: "white",
      _hover: {
        bg: `primary.green.200`,
      },
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
