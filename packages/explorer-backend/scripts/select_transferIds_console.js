copy(Array.from(document.querySelectorAll('.transferId a'))
    .map(element => element.getAttribute('data-clipboard-text')).filter(Boolean)
    .join(','))
