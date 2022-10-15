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
    addQuestion: {
      background: "primary.green.100",
      color: "text.white.100",
      width: "197px",
      height: "48px"
    },
    cancelGreenOutline: {
      borderColor: "primary.green.100",
      border: "1px",
      color: "primary.green.100",
      width: "173px",
      height: "48px"
    },
    saveGreenFilled: {
      background: "primary.green.100",
      color: "text.white.100",
      width: "173px",
      height: "48px"
    }
  },
};

export default Button;
