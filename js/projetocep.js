// Seleciona todos os elementos que serão utilizandos durante o código.
const enderecoForm = document.querySelector("#endereco-form");
const cepInput = document.querySelector("#cep");
const logradouroInput = document.querySelector("#logradouro");
const cidadeInput = document.querySelector("#cidade");
const bairroInput = document.querySelector("#bairro");
const estadoInput = document.querySelector("#estado");
const dddInput = document.querySelector("#ddd");

// Seleciona todos os inputs que possuem o atributo data-input.
const formInputs = document.querySelectorAll("[data-input]");

// Desabilita o botao de modal quando algo esta errado.
const desabilitaBotao = document.querySelector("#fechar-mensagem");

const fadeElement = document.querySelector("#fade");

// Validação da informação sendo inserida no campo de CEP.
cepInput.addEventListener("keypress", (e) => {

    // Valida oque é inserido no campo de CEP para aceitar somente numeros.
    const onlyNumbers = /[0-9]|\./;
    const key = String.fromCharCode(e.keyCode);

    // Realiza um teste para validar se o CEP submetido a analise é composto somente de numeros.
    // Caso não seja, o "if" cai dentro do "preventDefault".
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

// Valida os numeros inseridos a cada digitação que o usuário realiza.
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    // Checa a quantidade de digitos do CEP.
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

// Função para obter endereço da API ViaCEP.
const getAddress = async (cep) => {

    toggleLoader();

    // URL para utilizacao da API ViaCEP.
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    // Trecho para tratar excessão caso ocorra algum problema na conectividade do código com a API.
    try {
        // Realiza a requisição para a API
        const response = await fetch(apiUrl);

        // Recebe todos os dados do endereço via API baseando-se no CEP inserido.
        const data = await response.json();

        // Verifica se há erros nos dados de endereço recebidos
        if (!data.erro) { // Caso os dados estejam corretos
            // Atualiza os campos de endereço
            logradouroInput.value = data.logradouro;
            cidadeInput.value = data.localidade;
            bairroInput.value = data.bairro;
            estadoInput.value = data.uf;
            dddInput.value = data.ddd || '';

            // Armazena todas as informações do endereço no LocalStorage.
            localStorage.setItem("endereco", JSON.stringify(data));
        } else { // Caso haja alguma descrepancia nos dados recebidos da API.
            toggleMessage("CEP inválido, tente novamente.");
        }
    } catch (error) { // Trata o problema por meio de mensagens caso surja algum erro durante o recebimento das informações do endereço.
        console.error("Erro ao consultar endereço:", error);
        toggleMessage("Ocorreu um erro ao consultar o endereço. Tente novamente mais tarde.");
    }

    // Mostra o Loader de carregamento para cadastrar as informações.
    toggleLoader();
};

// Atribui função a ser executada quando a página web for totalmente carregada.
window.onload = () => {
    // Acessa o localStorage para obter os dados salvos na chave "endereco".
    const savedEndereco = localStorage.getItem("endereco");
    // Verifica se o acesso ao localStorage retornou algum valor.
    if (savedEndereco) {
        // Converte os dados de string JSON para objeto JS .
        const enderecoData = JSON.parse(savedEndereco);
        // Com os dados de enreço em formato objeto JS, preenche-se os campos do formulario com as informações recuperadas.
        fillAddressFields(enderecoData);
    }
};

// Função para preencher os campos do endereço.
const fillAddressFields = (enderecoData) => {
    logradouroInput.value = enderecoData.logradouro;
    cidadeInput.value = enderecoData.localidade;
    bairroInput.value = enderecoData.bairro;
    estadoInput.value = enderecoData.uf;
    dddInput.value = enderecoData.ddd || '';
};


// Mostra o Loader de carregamento para busca e inserção dos dados.
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

// Valida mensagem retorna caso seja inserido um CEP incorreto.
const toggleMessage = (msg) => {
    const messageElement = document.querySelector("#mensagem");
    const messageTextElement = document.querySelector("#mensagem p");
    messageTextElement.innerText = msg;
    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

// Ao clicar no botão "Fechar" é encerrado o modal de mensagem.
desabilitaBotao.addEventListener("click", () => toggleMessage());

// Função de validação da submição do envio do formulário.
enderecoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Exibe o loader de carregamento para validar que a operação do envio do formulario está em andamento.
    toggleLoader();

    // Cria um atraso de 1000 milissegundospara simular um envio de informação para o banco de dados.
    setTimeout(() => {
        // Oculta o Loader de carragamento, simulando o fim do envio.
        toggleLoader();
        // Exibe mensagem,
        toggleMessage("Endereço cadastrado com sucesso!");
        // Ao fim do envio das informações, reseta o formulario para seu estado padrão.
        enderecoForm.reset();
    }, 1000);
});