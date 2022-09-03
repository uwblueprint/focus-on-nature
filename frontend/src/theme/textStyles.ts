export enum FontWeights {
  REGULAR = 400,
  MEDIUM = 500,
  SEMIBOLD = 600,
  BOLD = 700,
}

const textStyles = {
  displayXLarge: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "32px",
    lineHeight: "140%",
  },
  displayLarge: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "24px",
    lineHeight: "150%",
  },
  displayMediumBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "24px",
    lineHeight: "150%",
  },
  displayMediumRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "24px",
    lineHeight: "150%",
  },
  displaySmallSemiBold: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "20px",
    lineHeight: "150%",
  },
  displaySmallRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "18px",
    lineHeight: "150%",
  },
  heading: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "14px",
    lineHeight: "150%",
  },
  subHeading: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "14px",
    lineHeight: "150%",
  },
  buttonSemiBold: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: "14px",
    lineHeight: "20px",
  },
  buttonRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "14px",
    lineHeight: "20px",
  },
  bodyBold: {
    fontWeight: FontWeights.BOLD,
    fontSize: "14px",
    lineHeight: "150%",
  },
  bodyRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "14px",
    lineHeight: "150%",
  },
  caption: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "14px",
    lineHeight: "150%",
  },
  xSmallMedium: {
    fontWeight: FontWeights.MEDIUM,
    fontSize: "12px",
    lineHeight: "150%",
  },
  xSmallRegular: {
    fontWeight: FontWeights.REGULAR,
    fontSize: "12px",
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
