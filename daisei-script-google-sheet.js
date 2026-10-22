// Crée un menu dédié dans Google Sheets à l'ouverture du fichier
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('DAISEI')
    .addItem('Ouvrir l\'assistant', 'showSidebar')
    .addToUi();
}

// Ouvre le volet latéral HTML
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Assistant DAISEI');
  SpreadsheetApp.getUi().showSidebar(html);
}

// Lit les lignes de la feuille active
function getSheetRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Récupère les données de la colonne A (à adapter selon ta structure)
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  return values.map((row, index) => ({
    rowNumber: index + 2,
    prompt: row[0]
  }));
}

// Écrit le résultat renvoyé par le navigateur dans la colonne B
function writeResultToCell(rowNumber, text) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(rowNumber, 2).setValue(text);
}






<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: sans-serif; padding: 12px; font-size: 13px; }
      button { width: 100%; padding: 8px; margin-top: 10px; cursor: pointer; }
      #status { margin-top: 12px; white-space: pre-wrap; font-size: 12px; }
    </style>
  </head>
  <body>
    <h3>Génération DAISEI</h3>
    <label>Clé API :</label>
    <input type="password" id="apiKey" style="width: 100%;" placeholder="Colle ta clé API ici">
    <button id="runBtn" onclick="processRows()">Traiter la colonne A</button>

    <div id="status">En attente...</div>

    <script>
      const API_URL = "https://daisei-api.ad6d-daiseicloudlab.aws.cloud.airbus.corp/api/v1/chat/completions";
      const MODEL = "gpt-4o"; // Remplace par le modèle valide sur ton API

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
        const statusDiv = document.getElementById('status');

        if (!apiKey) {
          alert("Merci de renseigner la clé API.");
          return;
        }

        statusDiv.innerText = "Lecture des cellules...";
        document.getElementById('runBtn').disabled = true;

        google.script.run
          .withSuccessHandler(async function(rows) {
            if (!rows || rows.length === 0) {
              statusDiv.innerText = "Aucune donnée trouvée en colonne A.";
              document.getElementById('runBtn').disabled = false;
              return;
            }

            for (let i = 0; i < rows.length; i++) {
              const item = rows[i];
              if (!item.prompt) continue;

              statusDiv.innerText = `Traitement ligne ${item.rowNumber} / ${rows.length + 1}...`;

              try {
                const answer = await callDaisei(item.prompt, apiKey);
                // Renvoie la réponse à Sheets pour l'écrire dans la case
                await new Promise((resolve) => {
                  google.script.run
                    .withSuccessHandler(resolve)
                    .writeResultToCell(item.rowNumber, answer);
                });
              } catch (err) {
                google.script.run.writeResultToCell(item.rowNumber, "Erreur: " + err.message);
              }
            }

            statusDiv.innerText = "Traitement terminé !";
            document.getElementById('runBtn').disabled = false;
          })
          .getSheetRows();
      }
    </script>
  </body>
</html>





