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
    render_to_html:function(fi){
	//use './.render_to_html' as function to render '.' or render as string
	if(fi.is_dir()){
	    var render_bloc= fi.get('.render_to_html');
	    if(render_bloc){
		return render_bloc.data(fi);
	    }else{
		return mr("",fi.ls(),mr_concat,function(v,k){
		    return file_system.render_to_html(fi.get(v));
		});
	    }
	}else{
	    return escapeHtml(fi.data.toString());
	}
    },
    boot_root:function(){
	var ret= new file_system.file_dir();
	return ret;
    },
    red_hello_buffer:function(){
	var tr= new file_system.file_dir();
	var text= new file_system.file_bloc('hello world!');
	tr.push('text',text);
	var render_to_html=new file_system.file_bloc(function(_tr){
	    var txt=_tr.get('text').data;
	    return "<a class='red'>"+escapeHtml(txt)+"</a>";
	});
	tr.push('.render_to_html',render_to_html);
	return tr;
    },
    start_buffer:function(){
	var bufs= new file_system.file_dir();
	//var hello_buf= new file_system.file_bloc('hello world!');
	var hello_buf= file_system.red_hello_buffer();
	bufs.push('hello',hello_buf);
	return bufs;
    },
    start_up:function(){
	var rt= file_system.boot_root();
	var data= new file_system.file_dir();
	data.push('buffers', file_system.start_buffer());
	rt.push('data', data);
	return rt;
    },
};

var root= file_system.start_up();
