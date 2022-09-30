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
    editModalCancel: {
      background: "background.grey.100",
      padding: "12px, 25px, 12px, 25px",
      radius: "6px",
      width: "109px",
      height: "48px",
    },
    editModalSave: {
      background: "primary.green.100",
      padding: "12px, 25px, 12px, 25px",
      radius: "6px",
      width: "91px",
      height: "48px",
      color: "text.white.100"
    }
  },
};

export default Button;
