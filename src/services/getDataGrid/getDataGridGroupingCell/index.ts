import { styles } from "../../../utils";

export default function getDataGridGroupingCell() {
  console.log("Fetching Data Grid Grouping Cell...");

  const dataGridPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Data Grid"
  );

  if (!dataGridPage) {
    console.log("Data Grid page not found.");
    return {};
  }

  const dataGridComponent = dataGridPage.findOne((node) =>
    node.name.includes("<DataGrid> | Grouping Cell")
  );

  if (!dataGridComponent || !("children" in dataGridComponent)) {
    console.log(
      "Data Grid Grouping Cell component not found or not have children."
    );
    return {};
  }

  const variantProperty = dataGridComponent.findOne(
    (node: any) =>
      node.variantProperties?.["Group?"] === "False" &&
      node.variantProperties?.Expanded === "False"
  );

  let tableCellNode, boxNode, stackNode, instance1Node, instance2Node;
  let iconNode, chevronRightFilledNode, vectorNode, body1Node;

  if (variantProperty && "children" in variantProperty) {
    tableCellNode = variantProperty.findOne(
      (node) => node.name === "<TableCell>"
    );
    if (tableCellNode && "children" in tableCellNode) {
      boxNode = tableCellNode.findOne((node) => node.name === "Box");
      if (boxNode && "children" in boxNode) {
        stackNode = boxNode.findOne((node) => node.name === "<Stack>");
        if (stackNode && "children" in stackNode) {
          instance1Node = stackNode.findOne(
            (node) => node.name === "Instance #1"
          );
          instance2Node = stackNode.findOne(
            (node) => node.name === "Instance #2"
          );

          if (instance1Node && "children" in instance1Node) {
            iconNode = instance1Node.findOne((node) => node.name === "<Icon>");
            if (iconNode && "children" in iconNode) {
              chevronRightFilledNode = iconNode.findOne(
                (node) => node.name === "ChevronRightFilled"
              );
              if (
                chevronRightFilledNode &&
                "children" in chevronRightFilledNode
              ) {
                vectorNode = chevronRightFilledNode.findOne(
                  (node) => node.name === "Vector"
                );
              }
            }
          }

          if (instance2Node && "children" in instance2Node) {
            body1Node = instance2Node.findOne((node) => node.name === "body1");
          }
        }
      }
    }
  }
  return {
    "& .MuiDataGrid-groupingCriteriaCell": {
      "& .MuiDataGrid-groupingCriteriaCellToggle": {
        marginRight: styles.getGapCss(stackNode).gap,
      },
      "& .MuiButtonBase-root": {
        ...styles.getPaddingCss(instance1Node),
        "& .MuiSvgIcon-root": {
          ...styles.getWidthCss(chevronRightFilledNode),
          ...styles.getHeightCss(chevronRightFilledNode),
          ...styles.getColorOrBackgroundCss(vectorNode, "color"),
        },
      },
      span: {
        ...styles.getFontFamilyCss(body1Node),
        ...styles.getFontSizeCss(body1Node),
        ...styles.getFontWeightCss(body1Node),
        ...styles.getLineHeightCss(body1Node),
        ...styles.getLetterSpacingCss(body1Node),
        ...styles.getColorOrBackgroundCss(body1Node, "color"),
      },
    },
  };
}
