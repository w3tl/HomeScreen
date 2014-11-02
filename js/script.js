window.onload = function () {
  var dragContainer = document.getElementById('dragcontainer');
    
  createAll();
  
  new Sortable(dragContainer, {
        onEnd: function(evt) {
          var elements = dragContainer.getElementsByClassName('b-window'),
              record;
          Array.prototype.forEach.call(elements, function(el, i){
            el.setAttribute('data-position', i + 1);
            record = getRecord(storageWindowString + el.getAttribute('id'));
            record.position = i + 1;
            setRecord(storageWindowString + el.getAttribute('id'), record);
          });
        }
      });
  
  // add new site
  document.getElementById('b-window-add').onclick = function(){
    var windows = dragContainer.getElementsByClassName('b-window'),
        pos = windows.length > 0 ? parseInt(windows[windows.length - 1].getAttribute('data-position')) + 1 : 1,
        record;
    record = {id: findEmptyId(),
              title: findEmptyCaption('New site'),
              address: "",
              position: pos, 
              fav: false,
              color: '3ff4d1'};
    if (document.getElementById('see-favs').classList.contains('b-toggle__button_active')) {
      record.fav = true; 
    }
    create(record);
    setRecord(storageWindowString + record.id, record);
  };
  
  document.querySelector('.b-s-top-panel__close .fa-trash-o').onclick = function() {
    document.getElementById('export-data').value = '';
  };
  
  document.getElementById('export').onclick = function() {
    var archive = allStorage(),
        exportData = document.getElementById('export-data');
    
    exportData.value = localStorage.getItem('com.HomeScreen.Settings') + '\n';
    
    archive.forEach(function(item, i, arr){
      exportData.value += JSON.stringify(item) + (i < archive.length - 1 ? '\n' : '');
    });
    exportData.select();
  }
  
  document.getElementById('import').onclick = function() {
    var data = document.getElementById('export-data').value,
        i = 0, record;
    data = data.split('\n');
    try {
      data.forEach(function(item, i, data){
        record = JSON.parse(item);
        if (record.id) {
          setRecord(storageWindowString + record.id, item); 
        } else {
          localStorage.setItem('com.HomeScreen.Settings', item); 
        }
      });
    } catch(e) {
      console.error(e.message); 
    }
    location.reload();
  }
  
  document.getElementById('export-button').onclick = function(){
    document.getElementById('d-export').style.display = 'block';
  }
  
  document.getElementById('remove-all').onclick = function(){
    deleteAll();
    location.reload();
  };
  
  document.getElementById('see-all').onclick = function(){
    var elements = dragContainer.getElementsByClassName('b-window');
    Array.prototype.forEach.call(elements, function(el, i){
      el.style.display = 'inline-block'; 
    });
    this.className = 'b-toggle__button b-toggle__button_active';
    document.getElementById('see-favs').className = 'b-toggle__button';
  }
  
  document.getElementById('see-favs').onclick = function(){
    var elements = dragContainer.getElementsByClassName('b-window'),
        record;
    Array.prototype.forEach.call(elements, function(el, i){
      record = getRecord(storageWindowString + el.getAttribute('id'));
      if (record.fav) {
        el.style.display = 'inline-block'; 
      } else {
        el.style.display = 'none';
      }
    });
    this.className ='b-toggle__button b-toggle__button_active';
    document.getElementById('see-all').className = 'b-toggle__button';
  }
  
  document.getElementById('b-main-title__edit-icon').onclick = function() {
    var title = document.getElementById('b-main-title').firstChild;
    if (title.getAttribute('contenteditable') != 'true') {
      title.setAttribute('contenteditable', true);
      this.firstChild.className = 'fa';
      title.focus();
    }
  }
  
  var settings = setting = document.getElementById('settings');
  
  document.getElementById('b-main-title__edit').addEventListener('focusout', function() {
    if (this.getAttribute('contenteditable') == 'true') {
      this.nextElementSibling.firstChild.className = 'fa fa-pencil';
      this.setAttribute('contenteditable', false);
      setRecord('com.HomeScreen.Settings', {title: this.innerHTML});
    }
  });
  
  var closeButtons = document.querySelectorAll('.b-s-top-panel__close .fa-close'),
      closeButton = function() {
        this.parentElement.parentElement.parentElement.style.display = 'none';
      };
  
  Array.prototype.forEach.call(closeButtons, function(el, i){
    el.addEventListener('click', closeButton, false);    
  });
      
  document.getElementById('b-button-save').onclick = function() {
    var currentId = document.getElementById('dragcontainer').getAttribute('data-current'),
        title = setting.querySelector('.b-s-main-panel .b-s-main-panel__options ul li input#opt-title').value,
        record = getRecord(storageWindowString + currentId),
        a = document.getElementById(currentId).lastChild,
        star = document.getElementById(currentId).querySelector('.b-window__button_star');
    
    record.title = title;
    record.address = setting.querySelector('.b-s-main-panel .b-s-main-panel__options ul li input#opt-address').value;
    record.fav = setting.querySelector('.b-s-main-panel .b-s-main-panel__options ul li input#opt-fav').checked;
    record.color = setting.querySelector('.b-s-main-panel .b-s-main-panel__options ul li input#opt-color').value;
    
    a.lastChild.innerHTML = title;
    a.childNodes[1].setAttribute('data-title', title.charAt(0));
    a.childNodes[1].style.backgroundColor = '#' + record.color;
    
    star.className = record.fav ? 'b-window__button b-window__button_star b-window__button_star_active' :
                                  'b-window__button b-window__button_star'; 
    setRecord(storageWindowString + currentId, record);
//    message save
    setting.style.display = 'none';
  }
}