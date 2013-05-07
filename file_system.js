var file_system={
    file_dir:function(){
	var items={};
	this={
	    mirror:function(){
		var ret= new file_system.file_dir();
		ret.items= mr({},items,
			      function(c,v){c[v[0]]=v[1];return c;},
			      function(v,k){return [k,v];}
			     );
		return ret;
	    },
	    patch:function(old){
		return this;
	    },
	    is_dir:function(){return true;},
	    ls:function(){
		return items.keys();
	    },
	    get:function(name){
		return items[name].mirror();
	    },
	    push:function(name,nw){
		var val= nw.patch(items[name]);
		items[name]= val;
		return val;
	    },
	};
    },
    file_bloc:function(_data){
	this={
	    data:_data,
	    mirror:function(){
		return new file_system.file_bloc(this.data);
	    },
	    path:function(old){
		return this;
	    },
	    is_dir:function(){return false;},
	};
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
    start_buffer:function(){
	var hello_buf= new file_system.file_bloc('hello world!');
	var bufs= new file_system.file_dir();
	bufs.push('hello',hello_buf);
	return bufs;
    },
    render_to_html:function(fi){
	//use './render_to_html' as function to render '.' or render as string
	if(fi.is_dir()){
	    var render_func= fi.get('render_to_html');
	    if(render_func){
		return render_func(fi);
	    }else{
		return mr("",fi.ls(),mr_concat,function(v,k){
		    return file_system.render_to_html(fi.get(v));
		});
	    }
	}else{
	    return escapeHtml(fi.data.toString());
	}
    },
    start_up:function(){
	var rt= file_system.boot_root();
	var data= new file_system.file_dir();
	data.push('buffers', file_system.start_buffer());
	rt.push('data', data);
    },
};

