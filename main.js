'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active')
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('db_client')) ?? []
}

function setLocalStorage(dbCliente) {
    return localStorage.setItem('db_client', JSON.stringify(dbCliente));
}

const createClient = (client) => {
    const dbCliente = getLocalStorage();
    dbCliente.push(client);
    setLocalStorage(dbCliente);
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '');
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
    updateTable();
}

//Interecao Layout

const saveClient = () => {
    if (isValidFields()) {
        const cliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(cliente);
            closeModal();
            updateTable();
        }else{
            updateClient(index, cliente);
            updateTable()
            closeModal()
        }

    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `

    document.querySelector('#tbClient>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll("#tbClient>tbody tr");
    rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index);
        } else {
            deleteClient(index)
        }
    }
}

updateTable()

//Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.querySelector("#tbClient>tbody")
    .addEventListener('click', editDelete)