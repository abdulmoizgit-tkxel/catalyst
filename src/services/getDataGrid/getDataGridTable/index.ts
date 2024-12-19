import { styles } from "../../../utils";

export default function getDataGridTable(): Record<string, any> {
  console.log("Fetching Data Grid Table...");

  const dataGridPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Data Grid"
  );

  if (!dataGridPage) {
    console.log("Data Grid page not found.");
    return {};
  }

  const dataGridConfig: Record<string, any> = {
    "&.MuiDataGrid-root--densityComfortable": {
      "& .MuiDataGrid-columnHeader": {
        "&.MuiDataGrid-columnHeaderCheckbox": {},
      },
      "& .MuiDataGrid-row": {
        "&:has(.MuiDataGrid-cellCheckbox)": {},
      },
    },
    "&.MuiDataGrid-root--densityCompact": {
      "& .MuiDataGrid-columnHeader": {
        "&.MuiDataGrid-columnHeaderCheckbox": {},
      },
      "& .MuiDataGrid-row": {
        "&:has(.MuiDataGrid-cellCheckbox)": {},
      },
    },
    "&.MuiDataGrid-root--densityStandard": {
      "& .MuiDataGrid-columnHeader": {
        "&.MuiDataGrid-columnHeaderCheckbox": {},
      },
      "& .MuiDataGrid-row": {
        "&:has(.MuiDataGrid-cellCheckbox)": {},
      },
    },
  };

  const dataGridComponents = dataGridPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<DataGridTable>"
  );

  dataGridComponents.forEach((dataGridComponentSet) => {
    if (dataGridComponentSet.type === "COMPONENT_SET") {
      dataGridComponentSet.children.forEach((dataGridVariant) => {
        if (dataGridVariant.type === "COMPONENT") {
          const variantProps = dataGridVariant.variantProperties;
          if (
            variantProps?.Rows === "5" &&
            variantProps?.Density &&
            variantProps?.Checkbox !== undefined
          ) {
            const density = variantProps.Density;
            const checkbox = variantProps.Checkbox;

            const densityKey = `&.MuiDataGrid-root--density${density}`;
            const columnHeaderStyles: Record<string, any> = {};
            const rowStyles: Record<string, any> = {};

            // For headers height
            const headerRowsNode = dataGridVariant.children.find(
              (child: any) => child.name === "<DataGrid> | Header Rows"
            );

            if (headerRowsNode) {
              const headerHeight = styles.getHeightCss(headerRowsNode);
              Object.entries(headerHeight).forEach(([key, value]) => {
                columnHeaderStyles[key] = `${value} !important`;
              });
            }

            // For row height
            const rowNode = dataGridVariant.children.find(
              (child: any) => child.name === "Row #1"
            );

            if (rowNode) {
              const rowHeight = styles.getHeightCss(rowNode);
              Object.entries(rowHeight).forEach(([key, value]) => {
                rowStyles[key] = `${value} !important`;
              });
              rowStyles.minHeight = `${rowHeight.height} !important`;
              rowStyles.maxHeight = `${rowHeight.height} !important`;
            }

            // Merge styles into dataGridConfig
            if (checkbox === "False") {
              Object.assign(
                dataGridConfig[densityKey]["& .MuiDataGrid-columnHeader"],
                columnHeaderStyles
              );
              Object.assign(
                dataGridConfig[densityKey]["& .MuiDataGrid-row"],
                rowStyles
              );
            }

            if (checkbox === "True") {
              Object.assign(
                dataGridConfig[densityKey]["& .MuiDataGrid-columnHeader"][
                  "&.MuiDataGrid-columnHeaderCheckbox"
                ],
                columnHeaderStyles
              );
              Object.assign(
                dataGridConfig[densityKey]["& .MuiDataGrid-row"][
                  "&:has(.MuiDataGrid-cellCheckbox)"
                ],
                rowStyles
              );
            }
          }
        }
      });
    }
  });

  return dataGridConfig;
}
