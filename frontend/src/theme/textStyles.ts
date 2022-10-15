export enum FontWeights {
  REGULAR = 400,
  MEDIUM = 500,
  SEMIBOLD = 600,
  BOLD = 700,
}

const textStyles = {
  displayXLarge: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "40px",
    lineHeight: "140%",
  },
  displayLarge: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "28px",
    lineHeight: "150%",
  },
  displayMediumBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "26px",
    lineHeight: "150%",
  },
  displayMediumRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "26px",
    lineHeight: "150%",
  },
  displaySmallSemiBold: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "24px",
    lineHeight: "150%",
  },
  displaySmallBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "18px",
    lineHeight: "150%",
  },
  displaySmallerSemiBold: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "18px",
    lineHeight: "150%",
  },
  displaySmallRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "24px",
    lineHeight: "150%",
  },
  heading: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "20px",
    lineHeight: "150%",
  },
  subHeading: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "16px",
    lineHeight: "150%",
  },
  buttonSemiBold: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "18px",
    lineHeight: "24px",
  },
  buttonRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "18px",
    lineHeight: "24px",
  },
  bodyBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "18px",
    lineHeight: "150%",
  },
  bodyRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "18px",
    lineHeight: "150%",
  },
  caption: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "16px",
    lineHeight: "150%",
  },
  xSmallBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "14px",
    lineHeight: "150%",
  },
  xSmallMedium: {
    fontWeight: FontWeights.MEDIUM,
    fontSize: "14px",
    lineHeight: "150%",
  },
  xSmallRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "14px",
    lineHeight: "150%",
  },
  informative: {
    fontWeight: FontWeights.BOLD,
    fontSize: "16px",
    color: "text.informative.100",
    lineHeight: "150%",
  },
};

export default textStyles;
