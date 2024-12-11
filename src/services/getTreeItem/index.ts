import { styles } from "../../utils/styles";

export default function getTreeView() {
  console.log("Fetching TreeView");

  const treeViewPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Tree View"
  );

  if (!treeViewPage) {
    console.log("Tree View page not found.");
    return {};
  }

  const treeViewConfig: Record<string, any> = {
    "& .MuiTreeItem-content": {
      "&:not(&.Mui-selected)": {
        "& .MuiTreeItem-label": {},
        "& .MuiSvgIcon-root": {},
      },
      "&.Mui-selected": {
        "& .MuiTreeItem-label": {},
        "& .MuiSvgIcon-root": {},
      },
      "&.Mui-disabled": {
        "& .MuiTreeItem-label": {},
        "& .MuiSvgIcon-root": {},
      },
      "&.Mui-expanded": {
        "&:not(&.Mui-selected)": {
          "& .MuiTreeItem-label": {},
          "& .MuiSvgIcon-root": {},
          "&.Mui-disabled": {
            "& .MuiTreeItem-label": {},
            "& .MuiSvgIcon-root": {},
          },
        },
        "&.Mui-selected": {
          "& .MuiTreeItem-label": {},
          "& .MuiSvgIcon-root": {},
        },
      },
    },
  };

  const allTreeViewComponents = treeViewPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TreeItem>"
  ) as ComponentSetNode[];

  allTreeViewComponents.forEach((treeItemSet) => {
    treeItemSet.children.forEach((variantNode) => {
      if (variantNode.type === "COMPONENT") {
        const variantProps = variantNode.variantProperties;

        if (
          variantProps &&
          "Selected" in variantProps &&
          "Disabled" in variantProps &&
          "State" in variantProps
        ) {
          const { Selected, Disabled, State } = variantProps;

          if (State === "Default" || State === "Expanded") {
            const selectedClass =
              Selected === "True" ? "&.Mui-selected" : "&:not(&.Mui-selected)";

            // Main node padding
            const padding = styles.getPaddingCss(variantNode);
            const background = styles.getColorOrBackgroundCss(
              variantNode,
              "background"
            );

            // Typography (label) details
            const typographyNode = variantNode.findChild(
              (node) => node.name === "<Typography>"
            );

            const textNode =
              typographyNode &&
              "children" in typographyNode &&
              typographyNode.children.find(
                (node) =>
                  node.name === "Selected" ||
                  node.name === "Default" ||
                  node.name === "Disabled"
              );

            const labelStyles = {
              ...styles.getFontFamilyCss(textNode),
              ...styles.getFontSizeCss(textNode),
              ...styles.getLetterSpacingCss(textNode),
              ...styles.getColorOrBackgroundCss(textNode, "color"),
              ...styles.getFontWeightCss(textNode),
            };

            // Icon details
            const iconContainer = variantNode.findChild(
              (node) =>
                node.name === "Icon Container" ||
                node.name === "ExpandMoreFilled"
            );

            const iconNode =
              iconContainer &&
              "children" in iconContainer &&
              iconContainer.children.find((node) => node.name === "Vector");

            const svgStyles = {
              ...styles.getColorOrBackgroundCss(iconNode, "color"),
            };

            if (State === "Default" && Disabled !== "True") {
              treeViewConfig["& .MuiTreeItem-content"][selectedClass] = {
                ...padding,
                ...background,
                "& .MuiTreeItem-label": labelStyles,
                "& .MuiSvgIcon-root": svgStyles,
              };
            }

            if (State === "Default" && Disabled === "True") {
              treeViewConfig["& .MuiTreeItem-content"][selectedClass] =
                treeViewConfig["& .MuiTreeItem-content"][selectedClass] || {};
              treeViewConfig["& .MuiTreeItem-content"][selectedClass][
                "&.Mui-disabled"
              ] = {
                ...padding,
                ...background,
                "& .MuiTreeItem-label": labelStyles,
                "& .MuiSvgIcon-root": svgStyles,
              };
            }

            if (State === "Expanded") {
              if (!treeViewConfig["& .MuiTreeItem-content"]["&.Mui-expanded"]) {
                treeViewConfig["& .MuiTreeItem-content"]["&.Mui-expanded"] = {
                  "&:not(&.Mui-selected)": {
                    "& .MuiTreeItem-label": {},
                    "& .MuiSvgIcon-root": {},
                    "&.Mui-disabled": {
                      "& .MuiTreeItem-label": {},
                      "& .MuiSvgIcon-root": {},
                    },
                  },
                  "&.Mui-selected": {
                    "& .MuiTreeItem-label": {},
                    "& .MuiSvgIcon-root": {},
                  },
                };
              }

              const expandedConfig =
                treeViewConfig["& .MuiTreeItem-content"]["&.Mui-expanded"];

              if (Selected === "True" && Disabled !== "True") {
                expandedConfig["&.Mui-selected"] = {
                  ...padding,
                  ...background,
                  "& .MuiTreeItem-label": labelStyles,
                  "& .MuiSvgIcon-root": svgStyles,
                };
              } else if (Selected === "False" && Disabled !== "True") {
                expandedConfig["&:not(&.Mui-selected)"] = {
                  ...padding,
                  ...background,
                  "& .MuiTreeItem-label": labelStyles,
                  "& .MuiSvgIcon-root": svgStyles,
                };
              } else if (Selected === "False" && Disabled === "True") {
                expandedConfig["&:not(&.Mui-selected)"]["&.Mui-disabled"] = {
                  ...padding,
                  ...background,
                  "& .MuiTreeItem-label": labelStyles,
                  "& .MuiSvgIcon-root": svgStyles,
                };
              }
            }
          }
        }
      }
    });
  });

  return {
    MuiTreeItem: {
      styleOverrides: {
        root: treeViewConfig,
      },
    },
  };
}
