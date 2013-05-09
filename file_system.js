var file_system={
    file_dir:function(_items){
	_items= _items||{};
	var items= mr({},_items,
		      function(c,v){c[v[1]]=v[0];return c;},
		      function(v,k){return [v,k];}
		     );
	this.mirror=function(){
	    var ret= new file_system.file_dir(items);
	    return ret;
	};
	this.patch=function(old){
	    return this;
	};
	this.is_dir=function(){return true;};
	this.ls=function(){
	    return mr([],items,mr_push,function(v,k){return k;});
	};
	this.get=function(name){
	    var tmp= items[name];
	    if(tmp){
		return tmp.mirror();
	    }
	    return null;
	};
	this.ref=function(name){
	    return items[name];
	};
	this.push=function(name,nw){
	    var val= nw.patch(items[name]);
	    items[name]= val;
	    return val;
	};
    },
    file_bloc:function(_data){
	this.data=_data;
	this.mirror= function(){
	    return new file_system.file_bloc(this.data);
	};
	this.patch=function(old){
	    return this;
	};
	this.is_dir=function(){return false;};
    },
    find:function(tree_root,reg){
	reg=reg||/.*/;
	return mr([],tree_root.ls(), function(collect,name){
	    var o= tree_root.get(name);
	    if(o.is_dir()){
		return collect.concat(mr([],file_system.find(o,reg),mr_push,function(v,k){return name+'/'+v;}));
	    }else{
		if(reg.test(name)) collect.push(name);
		return collect;
	    }
	});
    },
    boot_root:function(){
	var ret= new file_system.file_dir();
	return ret;
    },
    start_up:function(){
	var rt= file_system.boot_root();
	var data= new file_system.file_dir();
	rt.push('data', data);
	return rt;
    },
};

var root= file_system.start_up();
