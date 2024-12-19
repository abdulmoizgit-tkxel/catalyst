import { styles } from "../../../utils";

export function getDataGridCellRows(): Record<string, any> {
  console.log("Fetching Data Grid Cell Rows...");

  const dataGridPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Data Grid"
  );

  if (!dataGridPage) {
    console.log("Data Grid page not found.");
    return {};
  }

  const dataGridConfig: Record<string, any> = {
    "& .MuiDataGrid-row": {
      "& .MuiDataGrid-cell": {},
      "&:hover": {
        "& .MuiDataGrid-cell": {},
      },
      "&.Mui-selected": {
        "& .MuiDataGrid-cell": {},
      },
    },
  };

  const allDataGridComponents = dataGridPage.findAll(
    (node) =>
      node.type === "COMPONENT_SET" && node.name === "<DataGrid> | Cell Rows"
  );

  allDataGridComponents.forEach((dataGridComponentSet) => {
    if (dataGridComponentSet.type === "COMPONENT_SET") {
      dataGridComponentSet.children.forEach((dataGridVariant) => {
        if (dataGridVariant.type === "COMPONENT") {
          const variantProps = dataGridVariant.variantProperties;

          if (
            variantProps &&
            variantProps.Columns === "3" &&
            variantProps.Divider === "True"
          ) {
            const state = variantProps.State;

            const stateBackground = styles.getColorOrBackgroundCss(
              dataGridVariant,
              "backgroundColor"
            );
            const border = styles.getBordersCss(dataGridVariant);

            const cellNode = dataGridVariant.children.find(
              (child) => child.name === "Cell #1"
            );

            const cellPadding = cellNode ? styles.getPaddingCss(cellNode) : {};

            if (state === "Resting") {
              Object.assign(dataGridConfig["& .MuiDataGrid-row"], {
                ...stateBackground,
                "& .MuiDataGrid-cell": {
                  ...cellPadding,
                  borderTop: border.borderBottom,
                },
              });
            } else if (state === "Hover") {
              Object.assign(dataGridConfig["& .MuiDataGrid-row"]["&:hover"], {
                ...stateBackground,

                "& .MuiDataGrid-cell": {
                  ...cellPadding,
                  borderTop: border.borderBottom,
                },
              });
            } else if (state === "Selected") {
              Object.assign(
                dataGridConfig["& .MuiDataGrid-row"]["&.Mui-selected"],
                {
                  ...stateBackground,

                  "& .MuiDataGrid-cell": {
                    ...cellPadding,
                    borderTop: border.borderBottom,
                  },
                }
              );
            }
          }
        }
      });
    }
  });

  return dataGridConfig;
}
