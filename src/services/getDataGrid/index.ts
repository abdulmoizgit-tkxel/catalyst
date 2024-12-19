import { getDataGridCellRows } from "./getDataGridCellRows";
import getDataGridGroupingCell from "./getDataGridGroupingCell";
import getDataGridHeaderRows from "./getDataGridHeaderRows";
import getDataGridTable from "./getDataGridTable";
import getGridToolbarQuickFilter from "./getGridToolbarQuickFilter";

export function getDataGrid(): Record<string, any> {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          ...getDataGridCellRows(),
          ...getDataGridHeaderRows(),
          ...getDataGridTable(),
          ...getGridToolbarQuickFilter(),
          ...getDataGridGroupingCell(),
        },
      },
    },
  };
}
