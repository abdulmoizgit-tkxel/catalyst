import { styles } from "../../utils";

export default function getTimelineItem() {
  console.log("Fetching Timeline Item...");

  const timelineItemPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Timeline"
  );

  if (!timelineItemPage) {
    console.log("Timeline Item page not found.");
    return {};
  }

  const timelineItemConfig: Record<string, any> = {
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          "&:has(.MuiTimelineDot-filled)": {
            "& .MuiTypography-root": {},
          },
          "&:has(.MuiTimelineDot-outlined)": {
            "& .MuiTypography-root": {},
          },
        },
      },
    },
  };

  const allTimelineItemComponents = timelineItemPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TimelineItem>"
  ) as ComponentSetNode[];

  allTimelineItemComponents.forEach((timelineItemComponentSet) => {
    if (timelineItemComponentSet.type === "COMPONENT_SET") {
      timelineItemComponentSet.children.forEach((timelineItemVariant) => {
        if (timelineItemVariant.type === "COMPONENT") {
          const { Position, Variant } =
            timelineItemVariant.variantProperties || {};

          const variantKey =
            Variant === "Filled"
              ? "&:has(.MuiTimelineDot-filled)"
              : "&:has(.MuiTimelineDot-outlined)";

          const typographyConfig =
            timelineItemConfig.MuiTimelineItem.styleOverrides.root[variantKey][
              "& .MuiTypography-root"
            ];

          const dotContainerNode = timelineItemVariant.children.find(
            (child) => child.name === "Dot Container"
          );

          if (dotContainerNode) {
            // Extract gap from Dot Container

            // Dot Container => Main
            const mainNode =
              dotContainerNode &&
              "children" in dotContainerNode &&
              dotContainerNode.children.find((child) => child.name === "Main");

            if (mainNode) {
              const padding = styles.getPaddingCss(mainNode);

              // Dot Container => Main => Main
              const innerMainNode =
                mainNode &&
                "children" in mainNode &&
                mainNode.children.find((child) => child.name === "Main");

              if (innerMainNode) {
                const typographyStyles = {
                  ...styles.getLetterSpacingCss(innerMainNode),
                  ...styles.getFontSizeCss(innerMainNode),
                  ...styles.getFontWeightCss(innerMainNode),
                  ...styles.getFontFamilyCss(innerMainNode),
                };

                // Combine extracted styles
                Object.assign(typographyConfig, {
                  ...padding,
                  paddingLeft: styles.getGapCss(dotContainerNode).gap,
                  paddingRight: styles.getGapCss(dotContainerNode).gap,
                  ...typographyStyles,
                });
              }
            }
          }
        }
      });
    }
  });

  return timelineItemConfig;
}
