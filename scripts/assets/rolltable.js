import { AssetData } from './data.js';
import AssetReport from '../asset-report.js';
import { CONSTANTS } from '../constants.js';

/**
 * Extract assets from the given roll table
 * @param {RollTable|ClientDocumentMixin} table - The table to extract assets from.
 * @return {AssetData}
 */
export async function ExtractRollTableAssets(table) {
  const data = new AssetData({
    id: table?.id || '',
    name: table?.name || '',
    documentType: table?.documentName || 'Unknown',
  });

  if (!table) {
    return data;
  }

  if (table.data.img) {
    await data.AddAsset({
      id: table.id,
      key: 'img',
      parentID: table.id,
      parentType: table.documentName,
      documentType: table.documentName,
      location: AssetReport.Locations.RollTableImage,
      asset: table.data.img,
    });
  }

  const results = [];

  if (CONSTANTS.IsV8orNewer()) {
    if (table.data.results?.size) {
      results.push(...Array.from(table.data.results.values()));
    }
  } else {
    if (table.data.results?.length) {
      results.push(...table.data.results);
    }
  }

  for (const tableResult of results) {
    const img = tableResult?.data?.img || tableResult?.icon;
    if (img) {
      await data.AddAsset({
        id: tableResult.id,
        key: 'result.img',
        parentID: table.id,
        parentType: table.documentName,
        documentType: tableResult.documentName || 'TableResult',
        location: AssetReport.Locations.RollTableResultImage,
        asset: img,
      });
    }
  }

  return data;
}
