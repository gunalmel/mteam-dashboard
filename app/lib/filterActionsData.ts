import {Data, ScatterData} from 'plotly.js';
import {LayoutWithNamedImage} from '@/types';
import {actionsDictionary} from '@/app/ui/components/constants';

export const filterActionsData = (
  plotData: Data[],
  layoutConfig: LayoutWithNamedImage,
  selectedActionGroups: string[]
): {plotData: Data[]; layoutConfig: LayoutWithNamedImage} => {
  if (!plotData[0]) {
    return {plotData: [], layoutConfig: {images: []}};
  }

  const actionsScatterData = plotData[0] as ScatterData;
  const selectedActions = actionsDictionary.getActionNamesByGroups(selectedActionGroups);

  const filtered = actionsScatterData.customdata.reduce(
    (acc, value) => {
      if (selectedActions.includes(value as string)) {
        acc.textColor.push('rgba(0,0,0,1)');
        acc.hoverinfo.push('text');
        acc.opacity.push(1);
      } else {
        acc.textColor.push('rgba(0,0,0,0)');
        acc.hoverinfo.push('none');
        acc.opacity.push(0);
      }
      return acc;
    },
    {textColor: [] as string[], opacity: [] as number[], hoverinfo: [] as string[]}
  );

  return {
    plotData: [
      {
        ...actionsScatterData,
        marker: {
          ...actionsScatterData.marker,
          color: actionsScatterData.marker?.color,
          opacity: filtered.opacity
        },
        textfont: {
          ...actionsScatterData.textfont,
          color: filtered.textColor
        },
        // plotly.js doesn't give a mechanism to hide hovertext on a per-point basis but the below seemed to
        // work even when typescript type didn't allow and documentation didn't state. That means we can get rid off
        // ref variable to store initial state of scatterData and create a filtered set from it or replace fields within it to update the state.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        hoverinfo: filtered.hoverinfo
      },
      ...plotData.slice(1)
    ],
    layoutConfig: {
      ...layoutConfig,
      images: layoutConfig.images.map((image, idx) => {
        return (image.y as number) > 0 ? {...image, opacity: filtered.opacity[idx]} : image;
      }),
    }
  };
};
