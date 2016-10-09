function FilePathParserService() {
  this.cnt = 0;
  this.html = $('div');
}

FilePathParserService.prototype.getHierarchyStructure = function(files) {
  var result = {};

  for (key in files) {
    var parts = files[key].split('/');
    this.addProp(result, parts);
  }

  return result;
}

FilePathParserService.prototype.addProp = function(res, arr) {

  if (arr.length == 1) {
    var fname = arr.splice(0,1);
    res[fname[0]] = fname[0];
    return;
  }

  if (arr.length > 1) {
    var prop = arr.splice(0,1);

    if (!res.hasOwnProperty(prop)) {
      res[prop] = {};  
    }

    this.addProp(res[prop], arr);
  }

};

FilePathParserService.prototype.compressHierarchy = function(hierarchy) {
  var newObj = {};
  var path = "";

  traverse(hierarchy, newObj, path);

  return newObj;

  function traverse(obj, newObj, path) {
    for(var key in obj) {

      if (!path || typeof obj[key] != 'string') {
        path = path + String(key) + '/';
      }

      if (typeof obj[key] == 'string') {
        
        if (Object.keys(obj).length == 1) {
          newObj[path] = {};
          newObj[path][String(key) + '/'] = obj[key];
        }
        else {
          newObj[path] = obj[key];
        }
        
        path = "";
        continue;
      }

      if (typeof obj[key] == 'object' && Object.keys(obj[key]).length > 1) {
        newObj[path] = {};
        traverse(obj[key], newObj[path], "");
        path = "";
        continue;
      }
      
      traverse(obj[key], newObj, path);
      
      path = "";
      
    }
  }
};

FilePathParserService.prototype.generateAndApplyHtml = function(hierarchy, structure) {

  var list = $(document.createElement('ul'));

  var that = this;
  
  $.each(structure, function(index, file) {

    var label = (typeof file == 'string') ? file : index;
    
    var item = $('<li>' + label + '</li>');
      
    if (typeof structure[index] === 'object') {
      item.addClass('folder');
    }
    else if (typeof structure[index] === 'string') {
      item = $('<li><span class="file-name">' + label + '</span></li>');
      item.addClass('jk-file');
      item.attr("data-file-id", "diff-" + that.cnt);
      that.cnt = that.cnt + 1;
    }
    
    list.append(item);
    hierarchy.append(list);
    
    if (typeof structure[index] === 'object') {
      that.generateAndApplyHtml(list, structure[index]);
    }

  });

};