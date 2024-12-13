import { styles } from "../../utils";

export default function getTimelineDot() {
  console.log("Fetching Timeline Dot...");

  const timelineDotPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Timeline"
  );

  if (!timelineDotPage) {
    console.log("Timeline Dot page not found.");
    return {};
  }

  const timelineDotConfig: Record<string, any> = {
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          "&.MuiTimelineDot-filled": {},
          "&.MuiTimelineDot-outlined": {},
        },
      },
    },
  };

  const allTimeLineDotComponents = timelineDotPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TimelineDot>"
  ) as ComponentSetNode[];

  allTimeLineDotComponents.forEach((timeLineDotComponentSet) => {
    if (timeLineDotComponentSet.type === "COMPONENT_SET") {
      timeLineDotComponentSet.children.forEach((timeLineDotVariant) => {
        if (timeLineDotVariant.type === "COMPONENT") {
          const { Variant } = timeLineDotVariant.variantProperties || {};

          console.log(Variant);

          if (Variant) {
            const variantKey =
              Variant === "Filled*"
                ? "&.MuiTimelineDot-filled"
                : "&.MuiTimelineDot-outlined";

            const dotNode = timeLineDotVariant.children.find(
              (child) => child.name === "Dot"
            );

            if (dotNode) {
              timelineDotConfig.MuiTimelineDot.styleOverrides.root[variantKey] =
                {
                  ...styles.getWidthCss(dotNode),
                  ...styles.getHeightCss(dotNode),
                  ...styles.getBorderRadiusCss(dotNode),
                  ...styles.getBordersCss(dotNode, true),
                  ...styles.getColorOrBackgroundCss(dotNode, "background"),
                };
            }
          }
        }
      });
    }
  });

  return timelineDotConfig;
}
