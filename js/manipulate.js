var storageWindowString = 'com.HomeScreen.id';
  
  function getRecord(item) {
    return JSON.parse(localStorage.getItem(item));
  }
  function setRecord(item, record) {
    localStorage.setItem(item, JSON.stringify(record))   
  }

  function settingsClick() {
    var currentId = this.parentElement.getAttribute('id'),
        record = getRecord(storageWindowString + currentId);
    document.getElementById('dragcontainer').setAttribute('data-current', currentId);
    setting.querySelector('.b-s-main-panel__options ul li input#opt-address').value = record.address;
    setting.querySelector('.b-s-main-panel__options ul li input#opt-fav').checked = record.fav;
    setting.querySelector('.b-s-main-panel__options ul li input#opt-title').value = record.title; 
    setting.querySelector('.b-s-main-panel__options ul li input#opt-color').value = record.color;  
    setting.style.display = 'block';
  }

function starClick() {
    var id = this.parentElement.getAttribute('id'),
        record = getRecord( storageWindowString + id );

    if (this.classList.contains('b-window__button_star_active')) {
      record.fav = false;
      this.className = 'b-window__button b-window__button_star';
    } else {
      record.fav = true;
      this.className = 'b-window__button b-window__button_star b-window__button_star_active';
    }
    setRecord(storageWindowString + id, record);
//    message add to fav
}

function removeClick() {
  var id = this.parentElement.getAttribute('id'),
      pos = this.parentElement.getAttribute('data-position');
  // todo animation
  localStorage.removeItem(storageWindowString + id);
  document.getElementById('dragcontainer').removeChild(this.parentElement);
  var elements = dragContainer.childNodes,
      curPos, curId;
  Array.prototype.forEach.call(elements, function(el, i){
    if (i < elements.length - 1) {
      curPos = el.getAttribute('data-position');
      curId = el.getAttribute('id');
      if ( curPos > pos ) {        
        var record = getRecord( storageWindowString + curId );
        record.position -= 1;
        el.setAttribute("data-position", record.position);
        setRecord(storageWindowString + curId, record);
      }
    }
  });    
//    message if remove
  }

function create(elem) {
  var dragContainer = document.getElementById('dragcontainer');
  var figure = document.createElement('figure');
  figure.innerHTML = '<figure id="' + elem.id + '" class="b-window" data-position="' + elem.position + '" >\
      <span class="b-window__button b-window__button_settings"><i class="fa fa-cog"></i></span>\
      <span class="b-window__button b-window__button_star ' +
        (elem.fav ? ' b-window__button_star_active' : '') + '"><i class="fa fa-star"></i></span> \
      <span class="b-window__button b-window__button_remove"><i class="fa fa-trash"></i></span> \
      <a href="' + (elem.address == undefined ? '#' : elem.address) + '" class="b-window__img-link" title="' + elem.title +'" target="_blank"> \
        <div data-title="' + elem.title.charAt(0) + '" class="b-window__img"></div>' +
        '<figcaption class="b-window__title">' + elem.title + '</figcaption></a></figure>';

  var afterElement = findPrevElement(elem.position);
  if (afterElement) {
    afterElement.parentNode.insertBefore(figure.firstChild, afterElement.nextSibling);
  } else {
    dragContainer.insertBefore(figure.firstChild, dragContainer.firstChild);
  }
  document.getElementById(elem.id).getElementsByTagName('SPAN')[0].onclick = settingsClick;
  document.getElementById(elem.id).getElementsByTagName('SPAN')[1].onclick = starClick;
  document.getElementById(elem.id).getElementsByTagName('SPAN')[2].onclick = removeClick;
}

function findPrevElement(pos) {
  var elements = document.getElementById('dragcontainer').getElementsByClassName('b-window'),
      ret = null,
      num;
  Array.prototype.forEach.call(elements, function(el, i){
    num = el.getAttribute('data-position');
    if (pos > num) {
      ret = el; 
    }
  });
  if (!ret && elements.length != 0) {
    ret = null; 
  }
  return ret;
}

function findEmptyId() {
  var keys = Object.keys(localStorage);
      i = 1;
  if (keys.length) {
    while( keys.indexOf(storageWindowString + i) != -1 ) {
      i++;
    }
  }
  return i;
}

function findEmptyCaption(caption) {
  var archive = allStorage(),
      found = '';
  archive.some(function(entry){
    if (entry.title.search(caption) != -1) {
      var newFound = entry.title.split(' '),
          number = parseInt(newFound[newFound.length - 1]);
      if (!number) {
        found = 1;
      } else if (number > found) {
        found = number;
      }
    }
  });
  return caption.concat(' '.concat(found + 1));
}

function createAll() {
  var archive = allStorage(),
      title = document.getElementById('b-main-title__edit');
  try {
    title.innerHTML = JSON.parse(localStorage.getItem('com.HomeScreen.Settings')).title;
  } catch(e) {
    title.innerHTML = 'Home Screen';
  }
  archive.some(function(entry){create(entry);});    
}

function deleteAll() {
  var keys = Object.keys(localStorage);
  keys.some(function(entry){
    if (entry.search('com.HomeScreen') != -1 && 
        entry.search('Settings') == -1)
      localStorage.removeItem(entry);
  });  
}

function allStorage(){
  var archive = [],
      keys = Object.keys(localStorage);
  keys.some(function(entry){
    if (entry.search(storageWindowString) != -1) {
        archive.push( getRecord(entry) );
    }
  });
  return archive;
}