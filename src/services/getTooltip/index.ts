import { generateBoxShadowCSS, rgbToHex, styles } from "../../utils";

interface TooltipConfig {
  MuiPopper: {
    styleOverrides: {
      root: {
        [key: string]: any;
      };
    };
  };
}

export default function getTooltips() {
  console.log("Fetching Tooltips...");

  const tooltipsConfig: TooltipConfig = {
    MuiPopper: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const tooltipPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Tooltip"
  );

  if (!tooltipPage) {
    console.error("Tooltip page not found in Figma.");
    return {};
  }

  const tooltipComponents = tooltipPage.findAll((node) =>
    node.name.includes("<Tooltip>")
  );

  tooltipComponents.forEach((tooltipComponent) => {
    if (tooltipComponent.type === "COMPONENT_SET") {
      tooltipComponent.children.forEach((tooltipVariant) => {
        if (tooltipVariant.type === "COMPONENT") {
          const variantProps = tooltipVariant.variantProperties as any;

          if (variantProps?.Direction && variantProps.Direction === "None") {
            (tooltipVariant.children as readonly SceneNode[]).forEach(
              (variantChild) => {
                if (variantChild && variantChild.name === "Tooltip") {
                  // Define the base CSS with background, padding, borderRadius, and opacity
                  const baseCss = {
                    ...styles.getPaddingCss(variantChild),
                    ...styles.getColorOrBackgroundCss(
                      variantChild,
                      "backgroundColor"
                    ),
                    ...styles.getBorderRadiusCss(variantChild),
                    ...Object.fromEntries(
                      Object.entries(styles.getOpacityCss(variantChild)).map(
                        ([key, value]) => [key, `${value} !important`]
                      )
                    ),
                  };

                  // Apply the base CSS to the universal `.MuiTooltip-tooltip` class
                  tooltipsConfig.MuiPopper.styleOverrides.root[
                    "& .MuiTooltip-tooltip"
                  ] = {
                    ...baseCss,
                  };
                }
              }
            );
          }
        }
      });
    }
  });

  return tooltipsConfig;
}
