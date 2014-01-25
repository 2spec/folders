 function makeFolders() {
    var folderSelect = document.getElementById("folder-select");
    var folderDisplay = document.getElementById("folder-display");
    var _count = -1;
    var _nodes = [];
    var _fold = {};
    _fold.getCount = (function() {
        return _count;
    });

    _fold.incrementCount = (function() {
        _count += 1;
        return _count;
    });

    _fold.addNode = (function(node) {
        _nodes[node.id] = node;
        return true;
    });

   _fold.getNode= (function(id) {
       var ret = _nodes[id];
       if (typeof ret === 'undefined'){
           return false;
       }else{
           return ret;
       }
    });
    //    _fold.root = new FNode('');
   _fold.find= (function(id) {

       var ret = _nodes[id];
       if (typeof ret === 'undefined'){
           return false;
       }else{
           return ret;
       }
    });
   _fold.getRoots= (function() {
        var cats=[];
        for (var i = 0; i < _nodes.length; i++){
            if(!(_nodes[i].getParent())){
                cats.push(_nodes[i]);
            }
        }
        return cats;
    });

    _fold.addFolder = function(cn, pn) {
        this.addNode(cn);

        if (typeof pn !== 'undefined') {
            //add to parent
            pn.addFolder(cn);
            
        }

    };
    
    _fold.list = function(s) {
        var cats= this.getRoots();
//        var cats = this.root.getChildren();
        var s = '<option value="">No Folder</option>';
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            s += cat.list('');
        }

        folderSelect.innerHTML = s;
    };
    _fold.render = function() {

        var cats= this.getRoots();
        var s = '<h2>Folder Info</h2>';
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            s += cat.render();
        }

        folderDisplay.innerHTML = s;
    };
    return _fold;
}

function FNode(name) {
    this.id = Folders.incrementCount();
    this.name = name;
    this.parent = null;
    this.children = [];
    this.values = [];
}
FNode.prototype.getName = function() {

    return this.name;
};
FNode.prototype.addFolder = function(c) {

    
    c.parent = this;

    this.children.push(c);
    return c;
};
FNode.prototype.addItem = function(c) {
    this.values.push(c);

};

FNode.prototype.getChildren = function() {
    return this.children;
};


FNode.prototype.getValues = function() {
    return this.values;
};

FNode.prototype.hasChildren = function() {
    return this.children.length > 0;
};


FNode.prototype.hasValues = function() {
    return this.values.length > 0;
};

FNode.prototype.getParent = function() {
    return this.parent;
};
FNode.prototype.find = function(path) {
    return Folders.find(path);
};
FNode.prototype.getPath = function() {
    var path = '';
    var ptr = this.getParent();



    while (ptr !== null) {
        path += '/' + ptr.name;
        ptr = ptr.getParent();
    }
    path += this.name;
    console.log(path);
    return path;
};

FNode.prototype.render = function() {
    var ret = '';
    ret += '<div class="a-folder">';
    ret += '<div class="folder-name"><h3>' + this.getName() + '</h3></div>';
    ret += '<div class="items">';
    if (!this.hasValues()) {
        ret += 'No values';
    } else {
        var it = this.getValues();
        ret += '<ul>';
        for (var i = 0; i < it.length; i++) {
            ret += '<li>' + it[i] + '</li>';
        }
        ret += '</ul>';
    }
    ret += '</div>';
    ret += '<div class="sub-categories">';

    if (!this.hasChildren()) {
        ret += 'No Subcategories';
    } else {
        var ch = this.getChildren();
        for (var i = 0; i < ch.length; i++) {
            ret += ch[i].render();
        }
    }
    ret += '</div>';

    ret += '</div>';
    return ret;

};

FNode.prototype.list = function(s) {
    var ret = '';
    ret = '<option value="' + this.id + '">' + s + this.getName() + '</option>';
    if (this.hasChildren()) {
        var ch = this.getChildren();
        for (var i = 0; i < ch.length; i++) {
            ret += ch[i].list(s + '..');
        }
    }
    if (this.hasValues()) {

        var it = this.getValues();
        for (var i = 0; i < it.length; i++) {
            ret += '<option disabled="disabled">' + s + it[i] + '</option>';
        }
    }


    return ret;

};


Folders = window.Folders || makeFolders();



$('#folder-input').on('input', function(){
    if($(this).val().trim().length > 0){
        $('#item-input-container').removeClass('hidden');
    }else{
        $('#item-input-container').addClass('hidden');
    }
});
$('#folder-select').on('change', function(){
    if($(this).val().length > 0){
        $('#item-input-container').removeClass('hidden');
    }else{
        $('#item-input-container').addClass('hidden');
    }
});

$('form').on('submit', function(e) {
    e.preventDefault();

    
    var folderInput = $('#folder-input').val();
    folderInput=folderInput.trim();
    folderInput = (folderInput !== '') ? folderInput : false;
    var itemInput = $('#item-input').val();
    itemInput = itemInput.trim();
    var folderSelect = $('#folder-select').val();

    if (!folderInput && itemInput === '') {

        return;
    }

    if (!folderInput && itemInput !== '' && folderSelect === '') {

        return;
    }

    if (folderSelect === '') {

        var c = new FNode(folderInput);
        if (itemInput !== '') {

            
            c.addItem(itemInput);
        }

        Folders.addFolder(c);
    } else {
        var c = Folders.find(folderSelect);

        if (itemInput !== '') {

            
            c.addItem(itemInput);
        }
        if (folderInput) {
            var tmp = new FNode(folderInput);
            Folders.addFolder(tmp,c);
        }

    }
    Folders.list();
    Folders.render();
    $('.a-folder').on('click',
                     function(e){
                         if(e.target === this){
                     $(this).toggleClass("close-folder");
                     }
                     });
        $('.folder-name').on('click',
                     function(e){
                         if(e.target === this){
                     $(this).parent().toggleClass("close-folder");
                     }
                     });
    //
    var folderInput = $('#folder-input').val('');
    var itemInput = $('#item-input').val('');
    
    $('#item-input-container').addClass('hidden');
    $('#folder-select-container').removeClass('hidden');
    $('#delete-folder').removeClass('hidden');
});


$('#delete-folder').on('click', function(){
        Folders = makeFolders();
        Folders.list();
                $('#folder-display').html('<div class="empty-folder">No folder information to show</div>')
        var folderInput = $('#folder-input').val('');
    var itemInput = $('#item-input').val('');
    $('#item-input-container').addClass('hidden');
    $('#folder-select-container').addClass('hidden');
    $('#delete-folder').addClass('hidden');

});
