// Função para carregar os domínios salvos
function loadDomains() {
    chrome.storage.sync.get(['allowedDomains'], function(result) {
      const allowedDomains = result.allowedDomains || [];
      const domainListElement = document.getElementById('domain-list');
      domainListElement.innerHTML = ''; // Limpa a lista antes de preencher
  
      // Adiciona cada domínio na lista
      allowedDomains.forEach(function(domain) {
        const li = document.createElement('li');
        li.addEventListener('click', (res) => {
          removeDomain(res.target.innerText);
        });
        li.textContent = domain;
        domainListElement.appendChild(li);
      });

      if (allowedDomains.length == 0) {
        const li = document.createElement('li');
        li.textContent = "Não existem registros.";
        domainListElement.appendChild(li);
      }

    });
  }
  
  // Função para remover um domínio da lista
  function removeDomain(domain) {
    if (confirm(`Tem certeza de que deseja remover ${domain}?`)) {
      chrome.storage.sync.get(['allowedDomains'], function(result) {
        let allowedDomains = result.allowedDomains || [];
        const index = allowedDomains.indexOf(domain);
        if (index > -1) {
          allowedDomains.splice(index, 1);
          chrome.storage.sync.set({ allowedDomains: allowedDomains }, function() {
            loadDomains(); // Recarrega a lista de domínios
          });
        }
      });
    }
  }

  // Função para adicionar um domínio à lista
  function addDomain(domain) {
    chrome.storage.sync.get(['allowedDomains'], function(result) {
      const allowedDomains = result.allowedDomains || [];
      if (!allowedDomains.includes(domain)) {
        allowedDomains.push(domain);
        chrome.storage.sync.set({ allowedDomains: allowedDomains }, function() {
          loadDomains(); // Recarrega a lista de domínios
        });
      }
    });
  }
  
  // Função de inicialização
  document.addEventListener('DOMContentLoaded', function() {
    // Carregar a lista de domínios quando a página for carregada
    loadDomains();
  
    // Adiciona um domínio quando o botão for clicado
    document.getElementById('add-domain').addEventListener('click', function() {
      const domainInput = document.getElementById('domain-input');
      const domain = domainInput.value.trim();
      if (domain) {
        addDomain(domain);
        domainInput.value = ''; // Limpa o campo após adicionar
      }
    });
    // Carregar o estado da extensão ao abrir as opções
    chrome.storage.sync.get(['extensionEnabled'], function(result) {
        const isEnabled = result.extensionEnabled !== false; // se não estiver definido, assume true
        document.getElementById('toggleExtension').checked = isEnabled;
    });

    // Adicionar um ouvinte para salvar as alterações quando o checkbox for alterado
    document.getElementById('toggleExtension').addEventListener('change', function () {
        const isEnabled = this.checked;
        chrome.storage.sync.set({ 'extensionEnabled': isEnabled });
    });
    // Carregar o estado da extensão ao abrir as opções
      chrome.storage.sync.get(['extensionEnabled'], function(result) {
        const isEnabled = result.extensionEnabled !== false; // se não estiver definido, assume true
        document.getElementById('toggleExtension').checked = isEnabled;
    });

    // Adicionar um ouvinte para salvar as alterações quando o checkbox for alterado
    document.getElementById('toggleExtension').addEventListener('change', function () {
        const isEnabled = this.checked;
        chrome.storage.sync.set({ 'extensionEnabled': isEnabled });
    });
    
  });
  
  