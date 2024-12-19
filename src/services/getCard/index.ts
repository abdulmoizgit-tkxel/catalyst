import { styles } from "../../utils";

export default function getCard() {
  console.log("Fetching Card...");

  // Locate the Card page
  const cardPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Card"
  );

  if (!cardPage) {
    console.error("Card page not found");
    return {};
  }

  const cardContent = cardPage.findOne((node) => node.name === "<CardContent>");

  // Find the specific variant node
  const variantProperty = cardPage.findOne(
    (node: any) =>
      node.variantProperties?.["Small Screen"] === "False" &&
      node.variantProperties?.Blank === "False"
  );

  if (!variantProperty || !("children" in variantProperty)) {
    console.error("Required Card variant not found or has no children.");
    return {};
  }

  // Extract nodes and their styles
  const paperNode = variantProperty.findOne((node) => node.name === "<Paper>");
  let cardHeaderNode;

  if (paperNode && "children" in paperNode) {
    const cardElementsNode = paperNode.findOne(
      (node) => node.name === "Card Elements"
    );

    if (cardElementsNode && "children" in cardElementsNode) {
      cardHeaderNode = cardElementsNode.findOne(
        (node) => node.name === "<CardHeader>"
      );
    }
  }

  // Return the styles as a configuration object
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          "&.MuiPaper-root": {
            "&.MuiPaper-elevation": {
              ...Object.fromEntries(
                Object.entries(styles.getBorderRadiusCss(paperNode)).map(
                  ([key, value]) => [key, `${value} !important`]
                )
              ),
              ...Object.fromEntries(
                Object.entries(styles.getBoxShadowCSS(paperNode)).map(
                  ([key, value]) => [key, `${value} !important`]
                )
              ),
              ...Object.fromEntries(
                Object.entries(
                  styles.getColorOrBackgroundCss(paperNode, "background")
                ).map(([key, value]) => [key, `${value} !important`])
              ),
              "& .MuiCardContent-root": {
                ...styles.getPaddingCss(cardContent),
              },
            },
          },
        },
      },
    },
  };
}
