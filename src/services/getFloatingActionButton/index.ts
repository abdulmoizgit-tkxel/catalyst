import { styles } from "../../utils";

interface FabVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface FabButtonConfig {
  MuiFab: {
    styleOverrides: FabVariantConfig;
  };
}

export default function getFloatingActionButton() {
  console.log("Fetching FAB...");

  const fabConfig: FabButtonConfig = {
    MuiFab: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const fabPage = figma.root.children.find(
    (node) =>
      node.type === "PAGE" && node.name.trim() === "Floating Action Button"
  );

  if (!fabPage) {
    console.log("Fab Page not found.");
    return {};
  }

  const fabComponents = fabPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Fab>"
  ) as ComponentSetNode[];

  fabComponents.forEach((fabComponentSet) => {
    if (fabComponentSet.type === "COMPONENT_SET") {
      fabComponentSet.children.forEach((fabVariant) => {
        if (
          fabVariant.type === "COMPONENT" &&
          fabVariant.variantProperties &&
          "Variant" in fabVariant.variantProperties &&
          "Size" in fabVariant.variantProperties &&
          "Color" in fabVariant.variantProperties &&
          "State" in fabVariant.variantProperties &&
          fabVariant?.variantProperties?.Color !== "Inherit (white)"
        ) {
          const { Variant, Size, Color, State } = fabVariant.variantProperties;

          // Construct keys
          const colorKey =
            State === "Inherit"
              ? "&.MuiFab-colorInherit"
              : `&.MuiFab-${Color.toLowerCase()}`;
          const sizeKey = `&.MuiFab-size${Size}`;
          const variantKey = `&.MuiFab-${Variant.toLowerCase()}`;
          const stateKey = {
            Enabled: "",
            Hovered: "&:hover",
            Focused: "&:focus",
            Pressed: "&:active",
            Disabled: "&.Mui-disabled",
          }[State];

          // Ensure structure
          if (!fabConfig.MuiFab.styleOverrides.root[colorKey]) {
            fabConfig.MuiFab.styleOverrides.root[colorKey] = {};
          }
          if (!fabConfig.MuiFab.styleOverrides.root[colorKey][sizeKey]) {
            fabConfig.MuiFab.styleOverrides.root[colorKey][sizeKey] = {};
          }
          if (
            !fabConfig.MuiFab.styleOverrides.root[colorKey][sizeKey][variantKey]
          ) {
            fabConfig.MuiFab.styleOverrides.root[colorKey][sizeKey][
              variantKey
            ] = {};
          }

          const targetConfig =
            fabConfig.MuiFab.styleOverrides.root[colorKey][sizeKey][variantKey];

          // Extract styles for the main node
          const background = styles.getColorOrBackgroundCss(
            fabVariant,
            "background"
          );
          const boxShadow = styles.getBoxShadowCSS(fabVariant);

          const baseNode = fabVariant.children.find(
            (child) => child.name === "Base"
          );
          let borderRadius = {};
          let padding = {};
          let gap = {};
          let buttonStyles = {};

          if (baseNode) {
            borderRadius = styles.getBorderRadiusCss(baseNode);
            padding = styles.getPaddingCss(baseNode);
            gap = styles.getGapCss(baseNode);

            // Base => Button
            const buttonNode =
              baseNode &&
              "children" in baseNode &&
              baseNode.children.find((child) => child.name === "Button");

            if (buttonNode) {
              buttonStyles = {
                ...styles.getLetterSpacingCss(buttonNode),
                ...styles.getFontSizeCss(buttonNode),
                ...styles.getFontWeightCss(buttonNode),
                ...styles.getFontFamilyCss(buttonNode),
                ...styles.getColorOrBackgroundCss(buttonNode, "color"),
              };
            }
          }

          // Ripple CSS
          const rippleNode = fabVariant.children.find(
            (child) => child.name === "focusRipple"
          );
          let rippleStyles = {};
          if (rippleNode && "children" in rippleNode) {
            const innerRippleNode = rippleNode.children.find(
              (child) => child.name === "focusRipple"
            );
            rippleStyles = styles.getColorOrBackgroundCss(
              innerRippleNode,
              "color"
            );
          }

          // SVG CSS
          const addFilledNode =
            baseNode &&
            "children" in baseNode &&
            baseNode.children.find((child) => child.name === "AddFilled");

          let svgStyles = {};
          if (addFilledNode && "children" in addFilledNode) {
            const vectorNode = addFilledNode.children.find(
              (child) => child.name === "Vector"
            );

            if (vectorNode) {
              svgStyles = {
                ...styles.getColorOrBackgroundCss(vectorNode, "color"),
                ...styles.getWidthCss(addFilledNode),
                ...styles.getHeightCss(addFilledNode),
                ...styles.getFontSizeCss(addFilledNode),
              };
            }
          }

          // Combine all styles
          const combinedStyles = {
            ...background,
            ...boxShadow,
            ...borderRadius,
            ...padding,
            ...gap,
            ...buttonStyles,
          };

          // Assign styles based on the state
          if (!stateKey) {
            // State: Enabled
            targetConfig[
              "&:not(:hover):not(:active):not(:focus):not(.Mui-disabled)"
            ] = { ...combinedStyles };
            if (svgStyles) {
              targetConfig[
                "&:not(:hover):not(:active):not(:focus):not(.Mui-disabled)"
              ]["& .MuiSvgIcon-root"] = {
                ...svgStyles,
              };
            }
          } else if (stateKey === "&:hover") {
            // State: Hovered
            targetConfig[stateKey] = { ...combinedStyles };
            if (svgStyles) {
              targetConfig[stateKey]["& .MuiSvgIcon-root"] = { ...svgStyles };
            }
          } else if (stateKey === "&:active") {
            // State: Pressed
            targetConfig[stateKey] = { ...combinedStyles };
            if (svgStyles) {
              targetConfig[stateKey]["& .MuiSvgIcon-root"] = { ...svgStyles };
            }
          } else if (stateKey === "&:focus") {
            // State: Focused
            targetConfig[stateKey] = { ...combinedStyles };
            if (svgStyles) {
              targetConfig[stateKey]["& .MuiSvgIcon-root"] = { ...svgStyles };
            }
            if (rippleStyles) {
              targetConfig[stateKey]["& .MuiTouchRipple-root"] = {
                ...rippleStyles,
              };
            }
          } else if (stateKey === "&.Mui-disabled") {
            // State: Disabled
            targetConfig[stateKey] = { ...combinedStyles };
            if (svgStyles) {
              targetConfig[stateKey]["& .MuiSvgIcon-root"] = { ...svgStyles };
            }
          }
        }
      });
    }
  });

  return fabConfig;
}
