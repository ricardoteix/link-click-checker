chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'showPopup') {
        // Cria uma nova aba para o popup de confirmação
        chrome.tabs.create({
            url: chrome.runtime.getURL('confirmation-popup.html'),
            active: true
        });

        // Envia a URL para o popup através de postMessage
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'showLinkConfirmation',
                link: message.link
            });
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    // Verifica e atualiza a lista de domínios liberados
    chrome.storage.sync.get(['allowedDomains'], function(result) {
      let allowedDomains = result.allowedDomains || [];
  
      // Verifica se o domínio mail.google.com já está na lista
      if (!allowedDomains.includes('google.com')) {
        allowedDomains.push('google.com');
        
        // Salva novamente a lista de domínios liberados
        chrome.storage.sync.set({ 'allowedDomains': allowedDomains }, function() {
          if (chrome.runtime.lastError) {
            console.error("Erro ao salvar domínios: ", chrome.runtime.lastError);
          } else {
            console.log("Domínio mail.google.com adicionado com sucesso.");
          }
        });
      }
    });
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.runtime.openOptionsPage();
  });
