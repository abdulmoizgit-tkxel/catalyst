import { styles } from "../../../utils";

export default function getGridToolbarQuickFilter(): Record<string, unknown> {
  console.log("Fetching Grid Toolbar Quick Filter...");

  const dataGridPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Data Grid"
  );

  if (!dataGridPage) {
    console.log("Data Grid page not found.");
    return {};
  }

  const dataGridComponent = dataGridPage.findOne(
    (node) =>
      node.type === "COMPONENT" &&
      node.name.includes("<GridToolbarQuickFilter>")
  ) as ComponentNode;

  if (dataGridComponent && "children" in dataGridComponent) {
    const actionsNode = dataGridComponent.findOne(
      (node) => node.name === "<Actions>"
    );

    if (actionsNode && "children" in actionsNode) {
      const buttonNode = actionsNode.children.find(
        (node) => node.name === "<Button>"
      );

      if (buttonNode && "children" in buttonNode) {
        const baseNode = buttonNode.findOne((node) => node.name === "Base");

        if (baseNode && "children" in baseNode) {
          const maskedIconNode = baseNode.findOne(
            (node) => node.name === "Masked Icon"
          );

          const viewColumnFilledNode =
            maskedIconNode &&
            "children" in maskedIconNode &&
            maskedIconNode?.findOne((node) => node.name === "ViewColumnFilled");

          const vectorNode =
            viewColumnFilledNode &&
            "children" in viewColumnFilledNode &&
            viewColumnFilledNode?.findOne((node) => node.name === "Vector");

          const innerButtonNode = baseNode.findOne(
            (node) => node.name === "Button"
          );

          return {
            "& .MuiDataGrid-toolbarContainer": {
              ...styles.getGapCss(actionsNode),
              ...styles.getPaddingCss(dataGridComponent),
              "& .MuiButtonBase-root": {
                ...styles.getFontFamilyCss(innerButtonNode),
                ...styles.getFontSizeCss(innerButtonNode),
                ...styles.getLetterSpacingCss(innerButtonNode),
                ...styles.getFontWeightCss(innerButtonNode),
                "& .MuiButton-icon": {
                  marginRight: styles.getGapCss(baseNode).gap,
                  "& .MuiSvgIcon-root": {
                    ...styles.getColorOrBackgroundCss(vectorNode, "color"),
                    ...styles.getWidthCss(maskedIconNode),
                    ...styles.getHeightCss(maskedIconNode),
                  },
                },
              },
            },
          };
        }
      }
    }
  }

  return {};
}
