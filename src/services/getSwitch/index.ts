import { styles } from "../../utils";

interface SwitchVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface SwitchConfig {
  MuiSwitch: {
    styleOverrides: {
      root: {
        [key: string]: any;
      };
    };
  };
}

export default function getSwitches() {
  console.log("Fetching Switches...");

  const switchConfig: SwitchConfig = {
    MuiSwitch: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const switchPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Switch"
  );

  if (!switchPage) {
    return {};
  }

  const switchComponents = switchPage.findAll((node) => {
    return node.name.includes("<Switch>");
  });

  switchComponents.forEach((switchComponentSet) => {
    if (switchComponentSet.type === "COMPONENT_SET") {
      switchComponentSet.children.forEach((switchVariant) => {
        if (switchVariant.type === "COMPONENT") {
          const switchNode = switchVariant.children.find(
            (child) => child.name === "Switch"
          );

          if (!switchNode || !("children" in switchNode)) {
            return;
          }

          const variantProps = switchVariant.variantProperties;

          if (
            variantProps &&
            "Size" in variantProps &&
            "Color" in variantProps &&
            "State" in variantProps &&
            "Checked" in variantProps
          ) {
            const { Size, Color, State, Checked } = variantProps;

            let knobNode = {};
            let slideNode = {};
            let rippleColor = {};
            let hoverRippleStyling = {};

            const knobChild = switchNode.children.find(
              (child) => child.name === "Knob"
            );

            if (knobChild && "children" in knobChild) {
              const innerKnobChild = knobChild.children.find(
                (child) => child.name === "Knob"
              );
              if (State === "Focused" || State === "Pressed") {
                const focusRippleChild = knobChild?.children.find(
                  (child) => child.name === "focusRipple"
                );

                if (focusRippleChild) {
                  rippleColor = styles.getColorOrBackgroundCss(
                    focusRippleChild,
                    "color"
                  );
                }
              } else if (State === "Hovered") {
                hoverRippleStyling = {
                  ...styles.getColorOrBackgroundCss(
                    knobChild,
                    "backgroundColor"
                  ),
                  ...styles.getPaddingCss(knobChild),
                  ...styles.getBorderRadiusCss(knobChild),
                };
              }

              if (innerKnobChild) {
                knobNode = innerKnobChild;
              }
            }

            const slideChild = switchNode.children.find(
              (child) => child.name === "Slide"
            );

            if (slideChild && "children" in slideChild) {
              const innerSlideChild = slideChild.children.find(
                (child) => child.name === "Slide"
              );
              if (innerSlideChild) {
                slideNode = innerSlideChild;
              }
            }

            const knobBaseStyles = {
              ...styles.getColorOrBackgroundCss(knobNode, "backgroundColor"),
              ...styles.getBoxShadowCSS(knobNode),
              ...styles.getWidthCss(knobNode),
              ...styles.getHeightCss(knobNode),
            };

            const slideBaseStyles = {
              ...styles.getColorOrBackgroundCss(slideNode, "backgroundColor"),
              ...styles.getOpacityCss(slideNode),
            };

            const sizeKey = `&.MuiSwitch-size${Size}`;
            const checkedKey =
              Checked === "True"
                ? "& .Mui-checked"
                : "& .MuiSwitch-switchBase:not(.Mui-checked)";
            const colorKey = `&.MuiSwitch-color${Color}`;

            if (!switchConfig.MuiSwitch.styleOverrides.root[sizeKey]) {
              switchConfig.MuiSwitch.styleOverrides.root[sizeKey] = {};
            }

            if (
              !switchConfig.MuiSwitch.styleOverrides.root[sizeKey][checkedKey]
            ) {
              switchConfig.MuiSwitch.styleOverrides.root[sizeKey][checkedKey] =
                {};
            }

            if (
              !switchConfig.MuiSwitch.styleOverrides.root[sizeKey][checkedKey][
                colorKey
              ]
            ) {
              switchConfig.MuiSwitch.styleOverrides.root[sizeKey][checkedKey][
                colorKey
              ] = {};
            }

            const stateObject =
              switchConfig.MuiSwitch.styleOverrides.root[sizeKey][checkedKey][
                colorKey
              ];

            if (State === "Enabled") {
              stateObject["& .MuiSwitch-thumb"] = { ...knobBaseStyles };
              stateObject["& .MuiSwitch-track"] = { ...slideBaseStyles };
            } else if (State === "Hovered") {
              stateObject["&:hover"] = {
                "& .MuiSwitch-thumb": { ...knobBaseStyles },
                "& .MuiSwitch-track": { ...slideBaseStyles },
                ...hoverRippleStyling,
              };
            } else if (State === "Focused") {
              stateObject["&:focus"] = {
                "& .MuiSwitch-thumb": { ...knobBaseStyles },
                "& .MuiSwitch-track": { ...slideBaseStyles },
                ...rippleColor,
              };
            } else if (State === "Disabled") {
              stateObject["&.Mui-disabled"] = {
                "& .MuiSwitch-thumb": { ...knobBaseStyles },
                "& .MuiSwitch-track": { ...slideBaseStyles },
              };
            } else if (State === "Pressed") {
              stateObject["&:active"] = {
                "& .MuiSwitch-thumb": { ...knobBaseStyles },
                "& .MuiSwitch-track": { ...slideBaseStyles },
                ...rippleColor,
              };
            }
          }
        }
      });
    }
  });

  return switchConfig;
}
