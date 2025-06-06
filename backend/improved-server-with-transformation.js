// Verbeterde server met data transformatie
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Voor ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuratie
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// ----------- Functies voor data parsing ----------------------
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString() 
  });
});

// Functie om energie maand data om te zetten naar het gewenste formaat
function transformSheetData(sheetData) {
  // Controleer of er data is
  if (!sheetData || !sheetData.length) {
    return [];
  }

  const headers = sheetData[0]; // ["month", "2022", "2023", "2024", "2025"]
  const result = [];

  // Begin bij index 1 om de header rij over te slaan
  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    const obj = { month: row[0] }; // Maak een object met month property
    
    // Voeg alle jaren toe als properties
    for (let j = 1; j < headers.length; j++) {
      // Optioneel: converteer stringwaarden naar getallen
      const value = row[j] ? parseFloat(row[j]) : 0;

      const scaledValue = value;
      
      obj[headers[j]] = scaledValue;
    }
    
    result.push(obj);
  }
  
  return result;
}

// Functie om binnenklimaat data om te zetten naar het gewenste formaat
function transformBinnenklimaatData(data) {
  // Haal de header rij eruit
  const [header, ...rows] = data;
  
  // Converteer naar objecten
  const objects = rows.map(row => ({
    ruimte: row[0],
    temp: row[1],
    co2: row[2]
  }));
  
  // Retourneer in gewenste formaat
  return objects;
}

// Functie om WEII data om te zetten naar het gewenste formaat
function convertWeiiData(apiResponse) {
  const { elecData } = apiResponse;
  
  // Skip de header row (index 0) en converteer de rest
  return elecData.slice(1).map(row => ({
    year: parseInt(row[0]), // ts kolom
    totaal: parseFloat(row[5]) // Totaal kolom
  }));
}

// functie om rooster data om te zetten naar het gewenste formaat
function transformRoosterData(data) {
  // Haal de header rij eruit
  const roosterDataSheet = data;

  // Skip de header row (index 0) en converteer de rest
  return roosterDataSheet.slice(1).map(row => ({
    ruimteNaam: row[0],
    beschrijvingBezetting: row[1],
    urlLogo:  row[2]
  }));
}


// ----------------------------------------------------------
// ----------- Functies API end points ----------------------
// ----------------------------------------------------------

// API endpoint maand data energie gas
app.get('/api/energy-data-gas', async (req, res) => {
  try {
    // Path naar credentials file
    const keyFilePath = path.resolve(__dirname, 'credentials.json');
    
    if (!fs.existsSync(keyFilePath)) {
      return res.status(500).json({ 
        message: 'Credentials bestand niet gevonden' 
      });
    }
    
    // Laad credentials
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Maak auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Haal sheets client op
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Spreadsheet ID
    const spreadsheetId = '1yz_7UJzjiestBjRVwo9z6Oi9c6AzDhi99-gPCOq7tO4';
    
    // Haal gegevens op uit het specifieke werkblad en bereik
    const range = 'DB_Energie_Gas!A1:E13';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Controleer of er gegevens zijn
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Geen gegevens gevonden' 
      });
    }
    
    // Transformeer de data naar het gewenste formaat
    const transformedData = transformSheetData(rows);
    
    // Stuur de getransformeerde gegevens naar de client
    res.json({ 
      gasData: transformedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: `Fout bij het ophalen van gegevens: ${error.message}` 
    });
  }
});

// API endpoint maand data energie elektra
app.get('/api/energy-data-elec', async (req, res) => {
  try {
    // Path naar credentials file
    const keyFilePath = path.resolve(__dirname, 'credentials.json');
    
    if (!fs.existsSync(keyFilePath)) {
      return res.status(500).json({ 
        message: 'Credentials bestand niet gevonden' 
      });
    }
    
    // Laad credentials
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Maak auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Haal sheets client op
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Spreadsheet ID
    const spreadsheetId = '1yz_7UJzjiestBjRVwo9z6Oi9c6AzDhi99-gPCOq7tO4';
    
    // Haal gegevens op uit het specifieke werkblad en bereik
    const range = 'DB_Energie_Elektra!A1:E13';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Controleer of er gegevens zijn
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Geen gegevens gevonden' 
      });
    }
    
    // Transformeer de data naar het gewenste formaat
    const transformedData = transformSheetData(rows);
    
    // Stuur de getransformeerde gegevens naar de client
    res.json({ 
      elecData: transformedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: `Fout bij het ophalen van gegevens: ${error.message}` 
    });
  }
});

// API endpoint WEII data
app.get('/api/energy-data-weii', async (req, res) => {
  try {
    // Path naar credentials file
    const keyFilePath = path.resolve(__dirname, 'credentials.json');
    
    if (!fs.existsSync(keyFilePath)) {
      return res.status(500).json({ 
        message: 'Credentials bestand niet gevonden' 
      });
    }
    
    // Laad credentials
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Maak auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Haal sheets client op
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Spreadsheet ID
    const spreadsheetId = '1yz_7UJzjiestBjRVwo9z6Oi9c6AzDhi99-gPCOq7tO4';
    
    // Haal gegevens op uit het specifieke werkblad en bereik
    const range = 'DB_WEII!A1:F21';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Controleer of er gegevens zijn
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Geen gegevens gevonden' 
      });
    }
    
    // Transformeer de data naar het gewenste formaat
    const transformedDataWeii = convertWeiiData({elecData:rows})

    // Stuur de getransformeerde gegevens naar de client
    res.json({ 
      dataWeii: transformedDataWeii,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: `Fout bij het ophalen van gegevens: ${error.message}` 
    });
  }
});

// API endpoint binnenklimaat data
app.get('/api/tvvl-binnenklimaat-data', async (req, res) => {
  try {
    // Path naar credentials file
    const keyFilePath = path.resolve(__dirname, 'credentials.json');
    
    if (!fs.existsSync(keyFilePath)) {
      return res.status(500).json({ 
        message: 'Credentials bestand niet gevonden' 
      });
    }
    
    // Laad credentials
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Maak auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Haal sheets client op
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Spreadsheet ID
    const spreadsheetId = '1yz_7UJzjiestBjRVwo9z6Oi9c6AzDhi99-gPCOq7tO4';
    
    // Haal gegevens op uit het specifieke werkblad en bereik
    const range = 'DB_Binnenklimaat!A1:C13';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Controleer of er gegevens zijn
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Geen gegevens gevonden' 
      });
    }
    
    // Transformeer de data naar het gewenste formaat
    const transformedDataBinnenklimaat = transformBinnenklimaatData(rows);
    
    // Stuur de getransformeerde gegevens naar de client
    res.json({ 
      dataBinnenklimaat: transformedDataBinnenklimaat,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: `Fout bij het ophalen van gegevens: ${error.message}` 
    });
  }
});

// API endpoint ruimte roosters
app.get('/api/tvvl-rooster-data', async (req, res) => {
  try {
    // Path naar credentials file
    const keyFilePath = path.resolve(__dirname, 'credentials.json');
    
    if (!fs.existsSync(keyFilePath)) {
      return res.status(500).json({ 
        message: 'Credentials bestand niet gevonden' 
      });
    }
    
    // Laad credentials
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Maak auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Haal sheets client op
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Spreadsheet ID
    const spreadsheetId = '1yFuSapPk67pijoFZjKxZOr6rly6MY1wmQVUlvGjVwes';
    
    // Haal gegevens op uit het specifieke werkblad en bereik
    const range = 'rooster_output!A1:C10';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Controleer of er gegevens zijn
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Geen gegevens gevonden' 
      });
    }
    
    // Transformeer de data naar het gewenste formaat
    const transformedRoosterData = transformRoosterData(rows);
    
    // Stuur de getransformeerde gegevens naar de client
    res.json({ 
      roosterData: transformedRoosterData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: `Fout bij het ophalen van gegevens: ${error.message}` 
    });
  }
});

// Start de server
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Data gas: http://localhost:${PORT}/api/energy-data-gas`);
  console.log(`Data elektra: http://localhost:${PORT}/api/energy-data-elec`);
  console.log(`Data WEII: http://localhost:${PORT}/api/energy-data-weii`);
  console.log(`Data TVVL binnenklimaat: http://localhost:${PORT}/api/tvvl-binnenklimaat-data`);
  console.log(`Data TVVL rooster: http://localhost:${PORT}/api/tvvl-rooster-data`);
});