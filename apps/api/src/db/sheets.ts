/**
 * Get spreadsheet instance
 */
function getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.openById(CONFIG.SHEET_ID);
}

/**
 * Get all records from a sheet
 */
function getSheetData(sheetName: string): any[] {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const record: any = {};
    
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value = data[i][j];
      
      // Auto-parse JSON fields (fields ending with _json)
      if (typeof value === 'string' && header.endsWith('_json')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parse fails
        }
      }
      
      record[header] = value;
    }
    
    records.push(record);
  }
  
  return records;
}

/**
 * Get record by ID
 */
function getById(sheetName: string, id: string): any | null {
  const records = getSheetData(sheetName);
  
  for (let i = 0; i < records.length; i++) {
    if (records[i].id === id) {
      return records[i];
    }
  }
  
  return null;
}

/**
 * Insert record
 */
function insertRecord(sheetName: string, data: any): boolean {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = [];
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    let value = data[header] || '';
    
    // Auto-stringify JSON fields
    if (header.endsWith('_json') && typeof value === 'object') {
      value = JSON.stringify(value);
    }
    
    row.push(value);
  }
  
  sheet.appendRow(row);
  return true;
}

/**
 * Update record by ID
 */
function updateRecord(sheetName: string, id: string, updates: any): boolean {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  if (idIndex === -1) {
    throw new Error('No id column found');
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      // Update each field
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        
        if (updates.hasOwnProperty(header)) {
          let value = updates[header];
          
          // Auto-stringify JSON fields
          if (header.endsWith('_json') && typeof value === 'object') {
            value = JSON.stringify(value);
          }
          
          sheet.getRange(i + 1, j + 1).setValue(value);
        }
      }
      
      return true;
    }
  }
  
  return false;
}

/**
 * Delete record by ID
 */
function deleteRecord(sheetName: string, id: string): boolean {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false;
}