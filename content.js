document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'A' && target.href) {
        console.log(target.href)
        // Impede o clique até o usuário confirmar
        
        if (location.hostname == "mail.google.com") {
            
            const linkDomain = new URL(target.href).hostname;

            const linkUrl = target.href;

            if (linkDomain == "mail.google.com") {
                return;
            }
            
            event.preventDefault();

            // Verifica se o link contém o parâmetro "q="
            const urlParams = new URLSearchParams(new URL(linkUrl).search);
            const redirectUrl = urlParams.get('q');  // Obtém o valor do parâmetro "q"
            
            if (redirectUrl) {
                // Se o parâmetro "q" existir, significa que o link é um redirecionamento
                const finalDomain = new URL(redirectUrl).hostname;  // Extrai o domínio do destino final
                console.log("Link redirecionado para:", redirectUrl);
                console.log("Domínio final:", finalDomain);
                
                // Agora você pode usar o domínio final como deseja
                // Exemplo de exibição de confirmação
                showLinkConfirmation(redirectUrl, linkDomain);  // Use sua função de confirmação de link com a URL final
                return;
            }

            chrome.storage.sync.get(['allowedDomains'], function (result) {

                console.log(result);
                
                const allowedDomains = result.allowedDomains || [];
                
                // Se a lista de domínios liberados estiver vazia, mostre o popup para qualquer link
                if (allowedDomains.length === 0) {
                    showLinkConfirmation(target.href);
                } else {
                    // Verifica se o domínio do link termina com um dos domínios liberados
                    const isAllowed = allowedDomains.some(allowedDomain => linkDomain.endsWith(allowedDomain));

                    // Se o domínio do link não termina com um domínio liberado, exibe o popup de confirmação
                    if (!isAllowed) {
                        showLinkConfirmation(target.href);
                    } else {
                        // Se o domínio do link terminar com um domínio liberado, abre o link normalmente
                        window.open(target.href, '_blank');
                    }
                }

            });
        }
    }
    
}, true);

// Função para exibir o modal de confirmação
function showLinkConfirmation(linkHref, linkDomain="") {
    // Verifica se o contexto ainda é válido
    if (!document.body) {
        return; // Evita erro caso a página tenha sido descarregada
    }

    // Cria o fundo escurecido
    const backdrop = document.createElement('div');
    backdrop.id = 'phishing-backdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.zIndex = '9998'; // Coloca abaixo do modal

    // Cria o modal
    const modal = document.createElement('div');
    modal.id = 'phishing-popup';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.border = '2px solid #ccc';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    modal.style.padding = '20px';
    modal.style.zIndex = '9999'; // Coloca o modal acima do fundo escurecido
    modal.style.width = '450px';
    modal.style.textAlign = 'center';

    const domain = new URL(linkHref).hostname;

    if (linkDomain != "") {
        modal.innerHTML = `
          <h2>Aviso de segurança</h2>
          <p>O link redireciona de: <span id="domain-name" style="font-weight: bold; font-size: 22px; filter: drop-shadow(3px 3px 2px orange);"><br>${linkDomain}<br> -> <br>${domain}</span></p>
          <button id="confirm-btn" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 5px; cursor: pointer; border: none; border-radius: 5px;">Continuar</button>
          <button id="cancel-btn" style="background-color: #f44336; color: white; padding: 10px 20px; margin: 5px; cursor: pointer; border: none; border-radius: 5px;">Cancelar</button>
        `;
    } else {
        modal.innerHTML = `
          <h2>Aviso de segurança</h2>
          <p>O link leva para: <span id="domain-name" style="font-weight: bold; font-size: 22px; filter: drop-shadow(3px 3px 2px orange);">${domain}</span></p>
          <button id="confirm-btn" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 5px; cursor: pointer; border: none; border-radius: 5px;">Continuar</button>
          <button id="cancel-btn" style="background-color: #f44336; color: white; padding: 10px 20px; margin: 5px; cursor: pointer; border: none; border-radius: 5px;">Cancelar</button>
        `;
    }

    // modal.innerHTML += `<br><br><span>Teve problemas? desative a extensão.</span>`

    // Adiciona o fundo escurecido e o modal à página
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // Função de ação para o botão "Confirmar"
    document.getElementById('confirm-btn').addEventListener('click', function () {
        window.open(linkHref, '_blank'); // Abre o link em uma nova aba
        document.body.removeChild(backdrop); // Remove o fundo escurecido
        document.body.removeChild(modal);    // Remove o modal
    });

    // Função de ação para o botão "Cancelar"
    document.getElementById('cancel-btn').addEventListener('click', function () {
        document.body.removeChild(backdrop);  // Remove o fundo escurecido
        document.body.removeChild(modal);     // Remove o modal sem redirecionar
    });
}