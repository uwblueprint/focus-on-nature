const Checkbox = {
  variants: {
    primary: {
      icon: {
        color: "white",
        _hover: {
          bg: "primary.green.200",
        },
      },
      control: {
        _indeterminate: {
          bg: "primary.green.100",
        },
        _checked: {
          _hover: {
            bg: "primary.green.200",
          },
          bg: "primary.green.100",
        },
      },
    },
  },
};

export default Checkbox;
