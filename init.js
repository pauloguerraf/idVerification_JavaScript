import {fetchData} from './data-service.js'

console.clear();

export function init() {

     var list = [],
        dataList = [],
        filteredList = [],
        maxDisplayLimit = 0,
        textInput = document.querySelector('#text-filter'),
        displayList = document.querySelector('.list'),
        countMessage = document.querySelector('.count-message'),
        btnBuscar = document.querySelector('#btn-buscar'),
        divPaso2 = document.querySelector('#paso-2')
        
    const data = JSON.parse(fetchData())
    
    textInput.value=""


    document.onreadystatechange = function() { 
        if (document.readyState !== "complete") { 
            document.querySelector(".tm-page").style.visibility = "hidden"; 
            document.querySelector("#loader").style.visibility = "visible"; 
        } else { 
            document.querySelector("#loader").style.display = "none"; 
            document.querySelector(".tm-page").style.visibility = "visible"; 
        } 
        btnBuscar.addEventListener('click', getFilteredItems)
        generateDataList()
        getFilteredItems()
        getFilteredItems(null)
    } 
    
    function generateDataList() {
        if (!data) return
        for (var i = 0; i < data.length; i++) {
            list.push(data[i].a.toString())
        }
    }

    function generateCountMessage() {
        var msg = '',
            uniqueList = [...new Set(filteredList)],
            matches = uniqueList.length;
        switch (true) {
            case (matches === 0 && textInput.value.length===10):
            msg = 'Tu firma no se encuentra entre las rechazadas en la última etapa de verificación de firmas, sin embargo, esto no signfica que haya sido considerada valida, pues tu firma puede haber sido anulada en etapas previas, donde anularon más del 30% de firmas por cuestiones de forma, como el gramaje del papel, tamaño del formulario, etc.'
            countMessage.className = 'count-message uk-h4 uk-text-left uk-text-success uk-text-bold uk-text'
            divPaso2.style.display = 'none'
            divPaso2.style.height = '0px'
            break;
            case (matches === 1 && textInput.value.length===10):
            msg = 'Tu firma consta como ' + 'RECHAZADA' + ' en la etapa de verificación de firmas. Por favor, continúa al paso 2.'
            countMessage.className = 'count-message uk-h4 uk-text-left uk-text-danger uk-text-bold uk-text'
            divPaso2.style.display = 'block'
            divPaso2.style.height = 'auto'
            window.scrollBy(0, 200)
            break;
            default:
            msg = 'Recuerda ingresar únicamente los 10 dígitos de tu cédula. No utilices guiones, letras u otros símbolos.'
            countMessage.className = 'count-message uk-h4 uk-text-left uk-text-warning uk-text-bold uk-text'
            divPaso2.style.display = 'none'
            divPaso2.style.height = '0px'

        }
        countMessage.textContent = msg;
    }
  
    function generateListItem(item) {
        var li = document.createElement('li'),
            spanCedula = document.createElement('span')
        spanCedula.classList.add('cedula');
        spanCedula.textContent = item;
        li.appendChild(spanCedula);
        return li;
    }

    function generateList() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < filteredList.length; i++) {
        if (i < maxDisplayLimit) {
        var item = filteredList[i],
            li = generateListItem(item);
        frag.appendChild(li);
        }
        else break;
    }
    displayList.innerHTML = '';
    displayList.appendChild(frag);
    generateCountMessage();
    }

    function textMatch(item) {
        var searchTerm = textInput.value.toLowerCase(),
            itemText = (item).toLowerCase()
        
        return (itemText.indexOf(searchTerm) !== -1)
    }

    function getFilteredItems(e) {
        if(e)e.preventDefault()
        filteredList = list.filter(textMatch);
        generateList();
    }

    btnBuscar.addEventListener('click', getFilteredItems);
    
};