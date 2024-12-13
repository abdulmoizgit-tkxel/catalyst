import getAllModesColorSchemes from "../getAllModesColorSchemes";
import getBreakpoints from "../getBreakpoints";
import getButtonGroups from "../getButtonGroups";
import getButtons from "../getButtons";
import getColors from "../getColors";
import getShapes from "../getShapes";
import getSpacing from "../getSpacing";
import getTextStyles from "../getTextStyles";
import getChips from "../getChips";
import getRadio from "../getRadio";
import getInputLabels from "../getInputLabels";
import getCheckbox from "../getCheckbox";
import getFormLabels from "../getFormLabels";
import getFormHelperText from "../getFormHelperText";
import getTooltip from "../getTooltip";
import getTextfield from "../getTextfield";
import getTable from "../getTable";
import getBottomNavigationAction from "../getBottomNavigationAction";
import getDialog from "../getDialog";
import getList from "../getList";
import getSpeedDial from "../getSpeedDial";
import getLink from "../getLink";
import getMenu from "../getMenu";
import getPaper from "../getPaper";
import getPaginationItem from "../getPaginationItem";
import getPagination from "../getPagination";
import getAlert from "../getAlert";
import getDivider from "../getDivider";
import getTextFieldLabels from "../getTextFieldLabels";
import getToolbar from "../getToolbar";
import getIconButton from "../getIconButton";
import getAppBar from "../getAppbar";
import getAvatar from "../getAvatar";
import getTabs from "../getTabs";
import getSkeleton from "../getSkeleton";
import getAccordion from "../getAccordion";
import getBadges from "../getBadge";
import getToggleButton from "../getToggleButton";
import getToggleButtonGroup from "../getToggleButtonGroup";
import getSlider from "../getSlider";
import getCharts from "../getCharts";
import getBreadcrumbs from "../getBreadcrumbs";
import getStep from "../getStep";
import getStepper from "../getStepper";
import getMobileStepper from "../getMobileStepper";
import getSnackbar from "../getSnackbar";
import getRating from "../getRating";
import getBackdrop from "../getBackdrop";
import getImageListItemBar from "../getImageList";
import getIcons from "../getIcons";
import getPopover from "../getPopover";
import getTreeItem from "../getTreeItem";
import getFloatingActionButton from "../getFloatingActionButton";
import getTimelineDot from "../getTimelineDot";
import getTimelineItem from "../getTimelineItem";
import getTimeline from "../getTimeline";

export default function getThemeJson() {
  const colors = getColors();
  const typography = getTextStyles();
  const breakpoints = getBreakpoints();
  const spacing = getSpacing();
  const shape = getShapes();
  const colorSchemes = getAllModesColorSchemes();

  const theme = {
    colorSchemes: colorSchemes,
    "material/colors": colors,
    textStyles: typography,
    breakpoints,
    spacing,
    shape,
    components: {
      ...getButtons(),
      ...getButtonGroups(),
      ...getChips(),
      ...getRadio(),
      ...getCheckbox(),
      ...getInputLabels(),
      ...getFormLabels(),
      ...getFormHelperText(),
      ...getTooltip(),
      ...getTable(),
      ...getBottomNavigationAction(),
      ...getDialog(),
      ...getList(),
      ...getSpeedDial(),
      ...getLink(),
      ...getMenu(),
      ...getPaper(),
      ...getPagination(),
      ...getPaginationItem(),
      ...getAlert(),
      ...getDivider(),
      ...getTextfield(),
      ...getTextFieldLabels(),
      ...getToolbar(),
      ...getIconButton(),
      ...getAppBar(),
      ...getAvatar(),
      ...getTabs(),
      ...getSkeleton(),
      ...getAccordion(),
      ...getBadges(),
      ...getToggleButton(),
      ...getToggleButtonGroup(),
      ...getSlider(),
      ...getCharts(),
      ...getBreadcrumbs(),
      ...getStepper(),
      ...getStep(),
      ...getMobileStepper(),
      ...getSnackbar(),
      ...getRating(),
      ...getBackdrop(),
      ...getImageListItemBar(),
      ...getIcons(),
      ...getPopover(),
      ...getTreeItem(),
      ...getFloatingActionButton(),
      ...getTimelineDot(),
      ...getTimelineItem(),
      ...getTimeline(),
    },
  };

  console.log("Done...");

  return JSON.stringify(theme, null, 2);
}
