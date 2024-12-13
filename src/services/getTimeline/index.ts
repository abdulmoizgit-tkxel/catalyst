import { styles } from "../../utils";

export default function getTimeline() {
  console.log("Fetching Timeline...");

  const timelinePage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Timeline"
  );

  if (!timelinePage) {
    console.log("Timeline page not found.");
    return {};
  }

  const timelineConfig: Record<string, any> = {
    MuiTimeline: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const timeLineComponents = timelinePage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Timeline>"
  ) as ComponentSetNode[];

  timeLineComponents.forEach((timeLineComponent) => {
    if (timeLineComponent.type === "COMPONENT_SET") {
      timeLineComponent.children.forEach((timeLineVariant) => {
        if (timeLineVariant.type === "COMPONENT") {
          const variantProps = timeLineVariant.variantProperties;

          if (
            variantProps &&
            "Opposing" in variantProps &&
            "Variant" in variantProps &&
            "Position" in variantProps
          ) {
            const { Opposing, Variant, Position } = variantProps;

            if (
              Opposing === "True" &&
              Variant === "Filled" &&
              Position === "Left"
            ) {
              const connectorContainerNode = timeLineVariant.children.find(
                (child) => child.name === "Connector Container"
              );

              if (
                connectorContainerNode &&
                "children" in connectorContainerNode
              ) {
                const timelineConnectorNode = connectorContainerNode.findOne(
                  (node) => node.name === "Timeline/Elements/TimelineConnector"
                );

                if (
                  timelineConnectorNode &&
                  "children" in timelineConnectorNode
                ) {
                  const connectorNode = timelineConnectorNode.findOne(
                    (node) => node.name === "Connector"
                  );

                  Object.assign(
                    timelineConfig.MuiTimeline.styleOverrides.root,
                    {
                      "& .MuiTimelineConnector-root": {
                        ...styles.getColorOrBackgroundCss(
                          connectorNode,
                          "background"
                        ),
                      },
                    }
                  );
                }
              }

              const timelineItemNode = timeLineVariant.findOne(
                (node) => node.name === "<TimelineItem>"
              );

              if (timelineItemNode && "children" in timelineItemNode) {
                const dotContainerNode = timelineItemNode.findOne(
                  (node) => node.name === "Dot Container"
                );

                if (dotContainerNode && "children" in dotContainerNode) {
                  const opposingNode = dotContainerNode.findOne(
                    (node) => node.name === "Opposing"
                  );

                  if (opposingNode && "children" in opposingNode) {
                    const textNode = opposingNode.findOne(
                      (node) => node.name === "Opposing"
                    );
                    Object.assign(
                      timelineConfig.MuiTimeline.styleOverrides.root,
                      {
                        "& .MuiTimelineOppositeContent-root.MuiTypography-root":
                          {
                            ...styles.getColorOrBackgroundCss(
                              textNode,
                              "color"
                            ),
                            ...styles.getLetterSpacingCss(textNode),
                            ...styles.getFontSizeCss(textNode),
                            ...styles.getFontWeightCss(textNode),
                            ...styles.getFontFamilyCss(textNode),
                            paddingLeft: styles.getGapCss(dotContainerNode).gap,
                            paddingRight:
                              styles.getGapCss(dotContainerNode).gap,
                          },
                      }
                    );
                  }
                }
              }
            }
          }
        }
      });
    }
  });

  return timelineConfig;
}
