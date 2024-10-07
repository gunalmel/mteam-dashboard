import { useState, useEffect, useRef } from 'react';
import { ScatterData, Layout, Datum } from 'plotly.js';
import { parseCsvData } from '@/app/lib/csv/actionCsvParser';
import { icons } from '@/app/ui/components/constants';
import { LayoutWithNamedImage, ImageWithName } from '@/types';

const files = [
  '/mteam-dashboard-data/timeline-multiplayer-06102024.csv',
  '/mteam-dashboard-data/timeline-multiplayer-08052024.csv',
  '/mteam-dashboard-data/timeline-multiplayer-09182024.csv',
  '/mteam-dashboard-data/timeline-multiplayer-09302024.csv'
];

const apiUrl = 'https://content.dropboxapi.com/2/files/download';
const headers = {
  'Authorization': 'Bearer sl.u.AFTdu24CrFZES5scwnrapFV1kSN0ai7l2lj4z83FNRmW1ei1z-X3PsBOsASwsIphFwq7od6SqKaM60y09QImGGpeqqpPPaW2nukN4BmKicfaNnD0un184vTdzgOBKO_9g9cmSLV9ISidmQTnswpD5UBUZoVK7TGDUhgrm-r_usEGmOpmqwiSIs88A6hdsUuEknQj3-Gm_B65I-Zjond1NsbbfKpo6GRhvmZh4aTSJ2IOD3fFmn0tcoMOwAVE7wm1M-AYuGIYYgu_tGPJalr93aCJ3UnTHBsOucEwa_-EhR_8WmmLNC_Ag-FqvGNfm5A3z0HXuII3XAZyQea_xcfih0sSRABqE-jeBlss3y0ZrGYN5t4FiSxB0G41fRtoJl4T45HFWKmOzhc73ROp5cGmuS40G5xJKfTNXwTymgS4HHLTVxozqA7HQUNO3Ntb5yK47HIEFNk7DCLUqqRUY5_Hsc1ob1581S1x84AgEDc2P-RhU_hGPdY1cMlpIpwIzcD8wZA6VgBPPJTc-whU4XI3juYQPijxZmMmDOracS_1q9dNg4_jTnXhcXSB8pz4_SYslbal8YK4WID4-IKs0diJ68mue8bSBQTSYRxiEiyDHPx5e6kreX8HwpP6apPtIKEbk8hnVZchh4u3DylbRnYmeyN9VH_uacGEF1mVn410Rvm9bec50jyT2OXGBwzHTLgnIWqLr69a-TGChXzgDpS_XuNdqZ4CgNOY3O5TsDx32bS9rAAzgb7TNUxWlTu7-8b2njE-UN-BewlDdnWYcGVoPUV3SgajhFwaJ1t6R-HyY8bkBqmwexvZiLzpcOtzYPY0wLFHsd__zIRN8ohbBVVy0aJNt09pDLIH8kKFqhhsdkIsHVv9vM97-_90HC630t8eD3YQL1tQ7fFEV_aPpQ7kuTu6rqhtcMPdZGLXht3C3Rj-nRYHCpYW5KTeRCz2-DJRBEDDEZKN9aqLn3YBpvV5tpb3fRTVPnBFrDG7DyWo7Cx_YeEAmi3V6aRvRO_ELVWuwSm8QvZCh1p7CE4Edh-pPxxmJRXXTrcniOajILV0TFzQvkXV08bTsBl-vIyg1Snz2bVtwdBgDsqPL-5xFDjUpeZmQUmn_G62pNlBy76LlWsSjbrzMFvlGQBt533-3fJAyEud9TyjzBO4rywmZo0rmAb0La5y7pAE48Nmp2uOj1_1nTVXwaQVrrOZSjgfpbz4ZRU2kVPfJlhwlSqwDus7OpZV4S8yz6X9OSmTlFK4UMYiIF3f6QdQp8KRwJwoWty16WrIGo9EXKoohi1SAKq1lZUEmlh8zZAOB1o3gzGInu-ZIA',
  'Dropbox-API-Arg': JSON.stringify({
    path: files[3]
  })
};

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Partial<ScatterData>[]>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
    const [stageErrorImages, setStageErrorImages] = useState<Partial<ImageWithName>[]>([]);
    const parsedDataRef = useRef<{
        actionsScatterData: Partial<ScatterData>;
        errorsScatterData: Partial<ScatterData>;
        compressionLines: Partial<ScatterData>[];
        layoutConfig: Partial<LayoutWithNamedImage>;
        stageErrorImages: Partial<ImageWithName>[];
    } | null>(null);

    useEffect(() => {
      fetch(apiUrl, {
        method: 'POST',
        headers: headers
      })
        .then(response => response.text())
        .then(csvData => {
          parseCsvData(
            // 'https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv',
            csvData,
            (actionsScatterData, errorsScatterData, compressionLines, layoutConfig, stageErrorImages) => {
              parsedDataRef.current = {
                actionsScatterData,
                errorsScatterData,
                compressionLines,
                layoutConfig,
                stageErrorImages
              };
              setActionsLayout(layoutConfig);
              setStageErrorImages(stageErrorImages);
              updateActionsData(actionsScatterData, errorsScatterData, layoutConfig, compressionLines, selectedMarkers, stageErrorImages);
            }
          );
        })
        .catch(error => console.error(error));
        /*parseCsvData(
            // 'https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv',
            'https://www.dropbox.com/scl/fi/6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=lpar2ots&reject_cors_preflight=true&dl=1',
            (actionsScatterData, errorsScatterData, compressionLines, layoutConfig, stageErrorImages) => {
                parsedDataRef.current = {
                    actionsScatterData,
                    errorsScatterData,
                    compressionLines,
                    layoutConfig,
                    stageErrorImages
                };
                setActionsLayout(layoutConfig);
                setStageErrorImages(stageErrorImages);
                updateActionsData(actionsScatterData, errorsScatterData, layoutConfig, compressionLines, selectedMarkers, stageErrorImages);
            }
        );*/
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData({...parsedDataRef.current.actionsScatterData},
              {...parsedDataRef.current.errorsScatterData},
              {...parsedDataRef.current.layoutConfig},
                parsedDataRef.current.compressionLines,
                selectedMarkers,
                stageErrorImages
            );
        }
    }, [selectedMarkers]);

    const updateActionsData = (
        actionsScatterData: Partial<ScatterData>,
        errorsScatterData: Partial<ScatterData>,
        layoutConfig: Partial<LayoutWithNamedImage>,
        compressionLines: Partial<ScatterData>[],
        selectedMarkers: string[],
        stageErrorImages: Partial<ImageWithName>[]
    ) => {
        const filteredData = filterActionsData(actionsScatterData, layoutConfig, selectedMarkers);

        const updatedImages = [
            ...(filteredData.layoutConfig.images || []),
            ...stageErrorImages
        ];

        setActionsData([filteredData.scatterData, errorsScatterData, ...compressionLines]);
        setActionsLayout({ ...filteredData.layoutConfig, images: updatedImages });
    };

    const filterActionsData = (actionsScatterData: Partial<ScatterData>,
                               layoutConfig: Partial<LayoutWithNamedImage>,
                               selectedMarkers: string[]):
      { scatterData: Partial<ScatterData>; layoutConfig: Partial<Layout> } => {
        const { x, y, text, customdata, hovertext } = actionsScatterData;

        if (!x || !y) {
            return { scatterData: {}, layoutConfig: {} };
        }

        // Map selected markers to their corresponding icons
        const selectedIcons = selectedMarkers.map((marker) => icons[marker].name);

        const filteredIndices = customdata?.reduce<number[]>((acc, value, index) => {
            if (selectedIcons.includes(value as string)) {
                acc.push(index);
            }
            return acc;
        }, []);

        const filteredImages = layoutConfig.images?.filter((image) => image.name && selectedIcons.includes(image.name));

        return {
            scatterData: {
                ...actionsScatterData,
                x: filteredIndices?.map((index) => x[index]) as Datum[],
                y: filteredIndices?.map((index) => y[index]) as Datum[],
                marker: {
                    size: 18,
                    symbol: 'square',
                    color: filteredIndices?.map((index) => (actionsScatterData.marker?.color as string[])[index]),
                },
                text: text && filteredIndices?.map((index) => text[index]),
                hovertext: hovertext && filteredIndices?.map((index) => hovertext[index]),
            },
            layoutConfig: {
                ...layoutConfig,
                images: filteredImages
            },
        };
    };

    return { actionsData, actionsLayout };
};
