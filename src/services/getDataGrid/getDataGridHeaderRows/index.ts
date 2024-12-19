import { styles } from "../../../utils";

export default function getDataGridHeaderRows(): Record<string, any> {
  console.log("Fetching Data Grid Header Rows...");

  const dataGridPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Data Grid"
  );

  if (!dataGridPage) {
    console.log("Data Grid page not found.");
    return {};
  }

  const dataGridConfig: Record<string, any> = {
    "& .MuiDataGrid-columnHeader": {},
  };

  const dataGridComponents = dataGridPage.findAll(
    (node) =>
      node.type === "COMPONENT_SET" && node.name === "<DataGrid> | Header Rows"
  );

  dataGridComponents.forEach((dataGridComponentSet) => {
    if (dataGridComponentSet.type === "COMPONENT_SET") {
      dataGridComponentSet.children.forEach((dataGridVariant) => {
        if (dataGridVariant.type === "COMPONENT") {
          const variantProps = dataGridVariant.variantProperties;
          if (variantProps?.State && variantProps?.Columns === "3") {
            const state = variantProps.State;
            const columnHeaderStyles: Record<string, any> = {};
            const hoverStyles: Record<string, any> = {};

            const headerNode = dataGridVariant.children.find(
              (child: any) => child.name === "Cell #1"
            );

            if (headerNode && "children" in headerNode) {
              const containerNode = headerNode.children.find(
                (child: any) => child.name === "Container"
              );

              const separatorNode = headerNode.children.find(
                (child: any) => child.name === "Separator Container"
              );

              const iconButtonNode = headerNode.children.find(
                (child: any) => child.name === "<IconButton>"
              );
              const border = styles.getBordersCss(dataGridVariant);

              // For Resting state
              if (state === "Resting") {
                const padding = styles.getPaddingCss(headerNode);
                Object.assign(columnHeaderStyles, padding);
                Object.assign(
                  columnHeaderStyles,
                  Object.fromEntries(
                    Object.entries(border).map(([key, value]) => [
                      key,
                      `${value} !important`,
                    ])
                  )
                );

                if (containerNode && "children" in containerNode) {
                  const headerStyles = containerNode.children.find(
                    (child: any) => child.name === "Header"
                  );

                  if (headerStyles) {
                    const letterSpacing =
                      styles.getLetterSpacingCss(headerStyles);
                    const fontSize = styles.getFontSizeCss(headerStyles);
                    const fontWeight = styles.getFontWeightCss(headerStyles);
                    const fontFamily = styles.getFontFamilyCss(headerStyles);

                    columnHeaderStyles["& .MuiDataGrid-columnHeaderTitle"] = {
                      ...letterSpacing,
                      ...fontSize,
                      ...fontWeight,
                      ...fontFamily,
                    };
                  }

                  const gap = styles.getGapCss(containerNode);
                  columnHeaderStyles[
                    "& .MuiDataGrid-columnHeaderTitleContainer"
                  ] = {
                    ...gap,
                  };
                }
              }

              // For Hovered state
              if (state === "Hovered") {
                const padding = styles.getPaddingCss(headerNode);
                Object.assign(hoverStyles, padding);
                Object.assign(
                  hoverStyles,
                  Object.fromEntries(
                    Object.entries(border).map(([key, value]) => [
                      key,
                      `${value} !important`,
                    ])
                  )
                );

                if (containerNode && "children" in containerNode) {
                  const upArrowMainNode = containerNode.children.find(
                    (child: any) => child.name === "<Icon>"
                  );

                  const arrowUpwardFilled =
                    upArrowMainNode &&
                    "children" in upArrowMainNode &&
                    upArrowMainNode.children.find(
                      (child: any) => child.name === "ArrowUpwardFilled"
                    );

                  const vectorNode =
                    arrowUpwardFilled &&
                    "children" in arrowUpwardFilled &&
                    arrowUpwardFilled.children.find(
                      (child: any) => child.name === "Vector"
                    );

                  hoverStyles["& .MuiSvgIcon-root"] = {
                    ...styles.getColorOrBackgroundCss(vectorNode, "color"),
                  };

                  const headerStyles = containerNode.children.find(
                    (child: any) => child.name === "Header"
                  );

                  if (headerStyles) {
                    const letterSpacing =
                      styles.getLetterSpacingCss(headerStyles);
                    const fontSize = styles.getFontSizeCss(headerStyles);
                    const fontWeight = styles.getFontWeightCss(headerStyles);
                    const fontFamily = styles.getFontFamilyCss(headerStyles);

                    hoverStyles["& .MuiDataGrid-columnHeaderTitle"] = {
                      ...letterSpacing,
                      ...fontSize,
                      ...fontWeight,
                      ...fontFamily,
                    };
                  }

                  const gap = styles.getGapCss(containerNode);
                  hoverStyles["& .MuiDataGrid-columnHeaderTitleContainer"] = {
                    ...gap,
                  };
                }

                // Separator color
                if (separatorNode && "children" in separatorNode) {
                  const separatorStyles = separatorNode.children.find(
                    (child) => child.name === "Separator"
                  );

                  if (separatorStyles) {
                    const separatorColor = styles.getColorOrBackgroundCss(
                      separatorStyles,
                      "color"
                    );
                    hoverStyles["& .MuiDataGrid-columnSeparator"] = {
                      "& .MuiSvgIcon-root": {
                        ...separatorColor,
                      },
                    };
                  }
                }

                // MoreVertFilled Icon color
                if (iconButtonNode && "children" in iconButtonNode) {
                  const iconNode = iconButtonNode.children.find(
                    (child: any) => child.name === "<Icon>"
                  );

                  if (iconNode && "children" in iconNode) {
                    const moreVertFilled = iconNode?.children.find(
                      (child: any) => child.name === "MoreVertFilled"
                    );

                    if (moreVertFilled && "children" in moreVertFilled) {
                      const vectorNode = moreVertFilled?.children.find(
                        (child: any) => child.name === "Vector"
                      );

                      if (vectorNode) {
                        const iconColor = styles.getColorOrBackgroundCss(
                          vectorNode,
                          "color"
                        );
                        hoverStyles["& .MuiDataGrid-menuIcon"] = {
                          "& .MuiSvgIcon-root": {
                            ...iconColor,
                          },
                        };
                      }
                    }
                  }
                }
              }
            }

            // Merge styles into dataGridConfig
            Object.assign(
              dataGridConfig["& .MuiDataGrid-columnHeader"],
              columnHeaderStyles
            );
            if (Object.keys(hoverStyles).length) {
              dataGridConfig["& .MuiDataGrid-columnHeader"]["&:hover"] =
                hoverStyles;
            }
          }
        }
      });
    }
  });

  return dataGridConfig;
}
