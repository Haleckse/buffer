function DAISEI_PROMPT(prompt) {
  if (!prompt) return "";

  const apiKey = "COLLE_TA_CLE_API_ICI";
  const url = "https://daisei-api.ad6d-daiseicloudlab.aws.cloud.airbus.corp/api/v1/chat/completions";

  const payload = {
    model: "ton_nom_de_modele", // À remplacer par le modèle DAISEI que tu utilises
    messages: [
      { role: "user", content: prompt }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.choices && json.choices.length > 0) {
      return json.choices[0].message.content.trim();
    } else {
      return "Erreur : " + response.getContentText();
    }
  } catch (e) {
    return "Erreur d'appel : " + e.toString();
  }
}
