// Google Sheets URL-ni bura yazın və ID-ni çıxaraq
// URL nümunəsi: https://docs.google.com/spreadsheets/d/1kWOFZMLOqriuvZYCggi_dJ8CpeJJIrjKha8mRwoaCoo/edit
const SPREADSHEET_ID = '1kWOFZMLOqriuvZYCggi_dJ8CpeJJIrjKha8mRwoaCoo';

// Manual test funksiyası əlavə edək
function manualTest() {
  console.log('🧪 Manual test başlayır...');
  
  try {
    // Spreadsheet-ə əlaqə yoxla
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet açıldı:', ss.getName());
    
    const sheet = ss.getSheets()[0];
    console.log('✅ Sheet açıldı:', sheet.getName());
    console.log('📊 Mövcud sətir sayı:', sheet.getLastRow());
    
    // Test məlumatı
    const testData = {
      name: 'TEST İstifadəçi',
      school: 'TEST Məktəb', 
      class: 'TEST Sinif',
      totalScore: 5,
      timestamp: new Date().toLocaleString('az-AZ'),
      results: [
        { question: 'Test sual 1', userAnswer: 'A', correctAnswer: 'B', isCorrect: false },
        { question: 'Test sual 2', userAnswer: 'C', correctAnswer: 'C', isCorrect: true }
      ]
    };
    
    // Write funksiyasını test et
    const result = writeToSheet(testData);
    console.log('🔍 Manual test nəticəsi:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Manual test xətası:', error);
    return { success: false, error: error.toString() };
  }
}

function doPost(e) {
  try {
    console.log('📨 POST sorğusu alındı');
    console.log('📋 Raw event:', JSON.stringify(e));
    console.log('📋 POST data:', e.postData);
    
    let data;
    
    // Müxtəlif formatları dəstəklə
    if (e.postData && e.postData.contents) {
      console.log('📄 POST contents mövcuddur:', e.postData.contents);
      // JSON string formatı
      try {
        data = JSON.parse(e.postData.contents);
        console.log('✅ JSON parse uğurlu:', data);
      } catch (parseError) {
        console.log('❌ JSON parse xətası:', parseError);
        // Əgər form data formatındadırsa
        if (e.postData.type === 'application/x-www-form-urlencoded') {
          const params = new URLSearchParams(e.postData.contents);
          if (params.has('data')) {
            try {
              data = JSON.parse(params.get('data'));
              console.log('✅ Form data parse uğurlu:', data);
            } catch (formParseError) {
              console.log('❌ Form data parse xətası:', formParseError);
              return ContentService
                .createTextOutput('ERROR: Form data parse xətası - ' + formParseError.toString())
                .setMimeType(ContentService.MimeType.TEXT);
            }
          }
        } else {
          return ContentService
            .createTextOutput('ERROR: JSON parse xətası - ' + parseError.toString())
            .setMimeType(ContentService.MimeType.TEXT);
        }
      }
    } else if (e.parameter && e.parameter.data) {
      console.log('📄 Parameter data mövcuddur:', e.parameter.data);
      // URL parameter formatı
      try {
        data = JSON.parse(e.parameter.data);
        console.log('✅ Parameter parse uğurlu:', data);
      } catch (parseError) {
        console.log('❌ Parameter parse xətası:', parseError);
        return ContentService
          .createTextOutput('ERROR: Parameter parse xətası - ' + parseError.toString())
          .setMimeType(ContentService.MimeType.TEXT);
      }
    } else {
      console.log('❌ Heç bir məlumat formatı tapılmadı');
      console.log('📋 Available parameters:', Object.keys(e.parameter || {}));
      return ContentService
        .createTextOutput('ERROR: Məlumat tapılmadı. Available params: ' + Object.keys(e.parameter || {}).join(', '))
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    console.log('📊 Final parse edilmiş məlumat:', JSON.stringify(data));
    
    // Məlumatı Google Sheets-ə yaz
    const result = writeToSheet(data);
    console.log('📝 writeToSheet nəticəsi:', result);
    
    if (result.success) {
      console.log('✅ Uğurla yazıldı:', result);
      return ContentService
        .createTextOutput(`SUCCESS:${result.row}:${result.score}:${result.totalRows}`)
        .setMimeType(ContentService.MimeType.TEXT);
    } else {
      console.log('❌ Yazma xətası:', result.error);
      return ContentService
        .createTextOutput('ERROR: ' + result.error)
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
  } catch (error) {
    console.error('❌ doPost xətası:', error);
    return ContentService
      .createTextOutput('ERROR: doPost xətası - ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  try {
    console.log('🔍 GET sorğusu alındı');
    console.log('📋 Parametrlər:', e.parameter);
    
    // Əgər yalnız dashboard üçün məlumat istənirsə
    if (e.parameter.action === 'getResults') {
      return getResultsAsJSON();
    }
    
    // Image trick və ya GET parametrləri
    if (e.parameter.data) {
      // JSON data parametri
      try {
        const data = JSON.parse(e.parameter.data);
        const result = writeToSheet(data);
        
        if (result.success) {
          return ContentService
            .createTextOutput(`SUCCESS:${result.row}:${result.score}`)
            .setMimeType(ContentService.MimeType.TEXT);
        } else {
          return ContentService
            .createTextOutput('ERROR: ' + result.error)
            .setMimeType(ContentService.MimeType.TEXT);
        }
      } catch (parseError) {
        return ContentService
          .createTextOutput('ERROR: GET JSON parse xətası - ' + parseError.toString())
          .setMimeType(ContentService.MimeType.TEXT);
      }
    } 
    else if (e.parameter.name && e.parameter.school) {
      // URL parametrləri ilə
      try {
        const data = {
          name: e.parameter.name,
          school: e.parameter.school,
          class: e.parameter.class,
          totalScore: parseInt(e.parameter.score) || 0,
          timestamp: e.parameter.timestamp,
          results: []
        };
        
        // Sual cavablarını yığ
        for (let i = 1; i <= 10; i++) {
          if (e.parameter[`q${i}_question`]) {
            data.results.push({
              question: e.parameter[`q${i}_question`],
              userAnswer: e.parameter[`q${i}_user`] || 'Cavabsız',
              correctAnswer: e.parameter[`q${i}_correct`] || '',
              isCorrect: e.parameter[`q${i}_result`] === 'Düzgün'
            });
          }
        }
        
        const result = writeToSheet(data);
        
        if (result.success) {
          return ContentService
            .createTextOutput(`SUCCESS:${result.row}:${result.score}`)
            .setMimeType(ContentService.MimeType.TEXT);
        } else {
          return ContentService
            .createTextOutput('ERROR: ' + result.error)
            .setMimeType(ContentService.MimeType.TEXT);
        }
      } catch (error) {
        return ContentService
          .createTextOutput('ERROR: GET parametr xətası - ' + error.toString())
          .setMimeType(ContentService.MimeType.TEXT);
      }
    }
    else {
      // Dashboard üçün CSV formatında bütün məlumatları göndər
      return getResultsAsCSV();
    }
    
  } catch (error) {
    console.error('❌ doGet xətası:', error);
    return ContentService
      .createTextOutput('ERROR: doGet xətası - ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function writeToSheet(data) {
  try {
    console.log('📝 Sheet-ə yazılır:', JSON.stringify(data));
    
    // Spreadsheet-i aç
    console.log('📂 Spreadsheet açılır:', SPREADSHEET_ID);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet açıldı');
    
    // İlk sheet-i al
    let sheet = ss.getSheets()[0];
    console.log('📄 Sheet adı:', sheet.getName());
    console.log('📊 Mövcud sətir sayı:', sheet.getLastRow());
    
    // Əgər başlıq sətri yoxdursa, yarad
    if (sheet.getLastRow() === 0) {
      console.log('🏷️ Başlıq sətri yaradılır...');
      const headers = [
        'Tarix', 'Ad Soyad', 'Məktəb', 'Sinif', 'Ümumi Xal',
        'S1 Sual', 'S1 Cavab', 'S1 Düzgün', 'S1 Nəticə',
        'S2 Sual', 'S2 Cavab', 'S2 Düzgün', 'S2 Nəticə',
        'S3 Sual', 'S3 Cavab', 'S3 Düzgün', 'S3 Nəticə',
        'S4 Sual', 'S4 Cavab', 'S4 Düzgün', 'S4 Nəticə',
        'S5 Sual', 'S5 Cavab', 'S5 Düzgün', 'S5 Nəticə',
        'S6 Sual', 'S6 Cavab', 'S6 Düzgün', 'S6 Nəticə',
        'S7 Sual', 'S7 Cavab', 'S7 Düzgün', 'S7 Nəticə',
        'S8 Sual', 'S8 Cavab', 'S8 Düzgün', 'S8 Nəticə',
        'S9 Sual', 'S9 Cavab', 'S9 Düzgün', 'S9 Nəticə',
        'S10 Sual', 'S10 Cavab', 'S10 Düzgün', 'S10 Nəticə'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Başlıq sətirini format et
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      
      console.log('✅ Başlıq sətri yaradıldı');
    }
    
    // Yeni sətir nömrəsi
    const nextRow = sheet.getLastRow() + 1;
    console.log('📝 Yeni sətir nömrəsi:', nextRow);
    
    // Məlumat massivi hazırla
    const rowData = [
      data.timestamp || new Date().toLocaleString('az-AZ'),
      data.name || 'Bilinmir',
      data.school || 'Bilinmir',
      data.class || 'Bilinmir',
      data.totalScore || 0
    ];
    
    console.log('📋 İlk 5 sütun məlumatı:', rowData);
    
    // Hər sual üçün 4 sütun əlavə et
    for (let i = 0; i < 10; i++) {
      if (data.results && data.results[i]) {
        const result = data.results[i];
        rowData.push(
          result.question || '',
          result.userAnswer || 'Cavabsız',
          result.correctAnswer || '',
          result.isCorrect ? 'Düzgün' : 'Səhv'
        );
      } else {
        rowData.push('', '', '', '');
      }
    }
    
    console.log('📋 Tam məlumat sütun sayı:', rowData.length);
    console.log('📋 Yazılacaq məlumat (ilk 10 element):', rowData.slice(0, 10));
    
    // Məlumatı yaz
    console.log('✍️ Məlumat yazılır...');
    const range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);
    console.log('✅ Məlumat yazıldı!');
    
    // Yenidən yoxla ki, həqiqətən yazılıb
    const verifyRow = sheet.getRange(nextRow, 1, 1, 5).getValues()[0];
    console.log('🔍 Yazılan məlumat yoxlanır:', verifyRow);
    
    // Rəngləri təyin et
    const scoreCell = sheet.getRange(nextRow, 5); // Xal sütunu
    const score = data.totalScore || 0;
    
    if (score >= 9) {
      scoreCell.setBackground('#d4edda'); // Yaşıl
    } else if (score >= 7) {
      scoreCell.setBackground('#fff3cd'); // Sarı
    } else if (score >= 5) {
      scoreCell.setBackground('#f8d7da'); // Açıq qırmızı
    } else {
      scoreCell.setBackground('#f5c6cb'); // Qırmızı
    }
    
    console.log(`✅ Məlumat ${nextRow} sətrinə yazıldı, son sətir sayı:`, sheet.getLastRow());
    
    // Flush əməliyyatı
    SpreadsheetApp.flush();
    console.log('💾 Flush tamamlandı');
    
    return {
      success: true,
      row: nextRow,
      score: score,
      totalRows: sheet.getLastRow()
    };
    
  } catch (error) {
    console.error('❌ writeToSheet xətası:', error);
    console.error('❌ Error stack:', error.stack);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
  }
}

// Dashboard üçün CSV formatında məlumat göndər
function getResultsAsCSV() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];
    
    if (sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput('Tarix,Ad Soyad,Məktəb,Sinif,Xal\n')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Bütün məlumatları al
    const data = sheet.getDataRange().getValues();
    
    // CSV formatına çevir
    const csvContent = data.map(row => 
      row.slice(0, 5).map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    console.log('📊 CSV məlumat hazırlandı');
    
    return ContentService
      .createTextOutput(csvContent)
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('❌ getResultsAsCSV xətası:', error);
    return ContentService
      .createTextOutput('ERROR: CSV məlumat alına bilmədi - ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Dashboard üçün JSON formatında məlumat göndər
function getResultsAsJSON() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];
    
    if (sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput('[]')
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Başlıq sətirini al
    const headers = sheet.getRange(1, 1, 1, 5).getValues()[0];
    
    // Məlumat sətirlərini al (başlıqdan sonra)
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    
    // JSON obyektlərinə çevir
    const results = data.map(row => ({
      date: row[0] || '',
      name: row[1] || '',
      school: row[2] || '',
      class: row[3] || '',
      score: parseInt(row[4]) || 0
    }));
    
    console.log('📊 JSON məlumat hazırlandı:', results.length, 'qeyd');
    
    return ContentService
      .createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ getResultsAsJSON xətası:', error);
    return ContentService
      .createTextOutput('[]')
      .setMimeType(ContentService.MimeType.JSON);
  }
}
