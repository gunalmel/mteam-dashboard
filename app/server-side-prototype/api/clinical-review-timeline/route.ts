// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xhr2 from 'xhr2'; //needed by PapaParse remote file loading
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {parseCsvDataAsync} from '@/app/lib/csv/actionCsvParser';

global.XMLHttpRequest = xhr2.XMLHttpRequest;

export const revalidate = 60 * 60; // invalidate every hour

export async function GET() {
  try {
    return Response.json({data: await parseCsvDataAsync(PlotsFileSource.actions['09182024'].url)});
  } catch (error) {
    console.log(error);
    return Response.json({message: 'Error processing CSV', error: error}, {status: 500});
  }
}
