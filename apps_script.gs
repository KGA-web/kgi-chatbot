// Google Apps Script for KGI Chatbot Data Collection
// Go to https://script.google.com → New Script → Paste this → Deploy → New Deployment

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  
  var data = JSON.parse(e.postData.contents);
  
  var timestamp = new Date();
  var name = sanitize(data.name);
  var phone = sanitize(data.phone);
  var course = sanitize(data.course);
  var userType = sanitize(data.userType || 'student');
  
  // Validation
  if (!name || name.length < 2) {
    return ContentService.createTextOutput(JSON.stringify({error: 'Invalid name'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (!phone || phone.length < 10) {
    return ContentService.createTextOutput(JSON.stringify({error: 'Invalid phone'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Check if headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Type', 'Phone', 'Course', 'Inquiry', 'Status']);
  }
  
  // Append data
  sheet.appendRow([timestamp, name, userType, phone, course, '', 'New']);
  
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}

function sanitize(input) {
  if (!input) return '';
  return String(input).replace(/[<>]/g, '').slice(0, 100);
}

function doGet(e) {
  var phone = e.parameter.phone;
  
  if (phone) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1') || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][3] && data[i][3].toString() === phone) {
        return ContentService.createTextOutput(JSON.stringify({
          found: true,
          name: data[i][1],
          phone: data[i][3],
          course: data[i][4]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({found: false})).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput('KGI Chatbot API is running!');
}
