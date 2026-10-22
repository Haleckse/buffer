<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: sans-serif; padding: 12px; font-size: 13px; }
      label { display: block; margin-top: 8px; font-weight: bold; }
      input { width: 100%; box-sizing: border-box; padding: 6px; margin-top: 4px; }
      .row { display: flex; gap: 8px; }
      .row div { flex: 1; }
      button { width: 100%; padding: 8px; margin-top: 14px; cursor: pointer; font-weight: bold; }
      #status { margin-top: 12px; white-space: pre-wrap; font-size: 12px; }
    </style>
  </head>
  <body>
    <h3>Assistant DAISEI</h3>
    
    <label>Clé API :</label>
    <input type="password" id="apiKey" placeholder="Colle ta clé API">

    <div class="row">
      <div>
        <label>Col. Source :</label>
        <input type="text" id="srcCol" value="A" placeholder="ex: A">
      </div>
      <div>
        <label>Col. Cible :</label>
        <input type="text" id="targetCol" value="B" placeholder="ex: B">
      </div>
    </div>

    <button id="runBtn" onclick="processRows()">Lancer le traitement</button>
    <div id="status">En attente...</div>

    <script>
      const API_URL = "https://daisei-api.ad6d-daiseicloudlab.aws.cloud.airbus.corp/api/v1/chat/completions";
      const MODEL = "gpt-4o";

      async function callDaisei(prompt, apiKey) {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status + ": " + (await response.text()));
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
      }

      function processRows() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const srcCol = document.getElementById('srcCol').value.trim().toUpperCase();
        const targetCol = document.getElementById('targetCol').value.trim().toUpperCase();
        const statusDiv = document.getElementById('status');

        if (!apiKey) {
          alert("Merci de renseigner la clé API.");
          return;
        }

        statusDiv.innerText = "Lecture de la colonne " + srcCol + "...";
        document.getElementById('runBtn').disabled = true;

        google.script.run
          .withSuccessHandler(async function(rows) {
            if (!rows || rows.length === 0) {
              statusDiv.innerText = "Aucune donnée trouvée en colonne " + srcCol + ".";
              document.getElementById('runBtn').disabled = false;
              return;
            }

            for (let i = 0; i < rows.length; i++) {
              const item = rows[i];
              if (!item.prompt) continue;

              statusDiv.innerText = `Traitement ligne ${item.rowNumber} / ${rows.length + 1}...`;

              try {
                const answer = await callDaisei(item.prompt, apiKey);
                await new Promise((resolve) => {
                  google.script.run
                    .withSuccessHandler(resolve)
                    .writeResultToCell(item.rowNumber, targetCol, answer);
                });
              } catch (err) {
                google.script.run.writeResultToCell(item.rowNumber, targetCol, "Erreur: " + err.message);
              }
            }

            statusDiv.innerText = "Traitement terminé !";
            document.getElementById('runBtn').disabled = false;
          })
          .getSheetRows(srcCol);
      }
    </script>
  </body>
</html>






function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('DAISEI')
    .addItem('Ouvrir l\'assistant', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Assistant DAISEI');
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSheetRows(colLetter) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const colIndex = sheet.getRange(colLetter + "1").getColumn();
  const values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();

  return values.map((row, index) => ({
    rowNumber: index + 2,
    prompt: row[0]
  }));
}

function writeResultToCell(rowNumber, colLetter, text) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(colLetter + rowNumber).setValue(text);
}
